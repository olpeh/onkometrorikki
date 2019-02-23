const GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const request = require('request');
import { Status } from './../models/Status';

require('dotenv').config();
const debugBrokenRandomly = process.env.DEBUG_BROKEN_RANDOMLY || false;

/*
Deprecated Types
The values below are retained for backwards-compatibility with existing feeds;
feed-reading applications should continue to understand these, but they shouldn't be used in new feeds.
s://sites.google.com/site/gtfschanges/proposals/route-type

Value
	Name
	Corresponding New Value
0
	Tram, Light Rail, Streetcar
	900
1
	Subway, Metro
	400
2
	Rail
	100
3
	Bus
	700
4
	Ferry 	1000
5
	Cable Car
	1701
6
	Gondola, Suspended cable car
	1300
7
	Funicular
	1400
*/
const METRO_ROUTE_TYPE_OLD = 1;
const METRO_ROUTE_TYPE_NEW = 400;

const fetchFeed = async () => {
  console.log('Going to fetch from the external API');
  return new Promise((resolve, reject) => {
    if (debugBrokenRandomly && Math.random() >= 0.3) {
      console.log(`******************** Debug RANDOMLY BREAK mode on!*************************
      Servinc alerts randomly from test binary feed and randomly from real feed!`);
      const fs = require('fs');
      const path = require('path');
      var content = fs.readFileSync(
        path.join(__dirname, '../tests/assets/alerts')
      );
      const feed = GtfsRealtimeBindings.FeedMessage.decode(content);
      resolve(feed);
    } else {
      const requestOptions = {
        method: 'GET',
        url: 'https://api.digitransit.fi/realtime/service-alerts/v1/',
        encoding: null
      };

      request(requestOptions, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log('Fetch successful!');
          const feed = GtfsRealtimeBindings.FeedMessage.decode(body);
          resolve(feed);
        } else {
          console.error(error);
          reject(error);
        }
      });
    }
  });
};

const createResponse = (feed): Status => {
  const defaultResponse: Status = {
    broken: false,
    reasons: []
  };

  if (!feed) {
    console.log('No feed was provided...');
    return {
      ...defaultResponse,
      reasons: ['Failed to fetch the feed. The Metro might work or might not.']
    };
  } else {
    let brokenCount = 0;
    let reasons = [];
    feed.entity.forEach(function(entity) {
      let thisAlertForBrokenMetro = false;
      if (entity.alert) {
        if (
          entity.alert &&
          entity.alert.informed_entity &&
          entity.alert.informed_entity.length > 0 &&
          (entity.alert.informed_entity[0].route_type == METRO_ROUTE_TYPE_OLD ||
            entity.alert.informed_entity[0].route_type == METRO_ROUTE_TYPE_NEW)
        ) {
          brokenCount++;
          thisAlertForBrokenMetro = true;
        }

        if (
          thisAlertForBrokenMetro &&
          entity.alert.description_text &&
          entity.alert.description_text.translation &&
          entity.alert.description_text.translation.length > 0 &&
          entity.alert.description_text.translation[0].text
        ) {
          reasons.push(entity.alert.description_text.translation[0].text);
        }
      }
    });

    return {
      ...defaultResponse,
      broken: brokenCount > 0,
      reasons: [...defaultResponse.reasons, ...reasons]
    };
  }
};

module.exports = {
  fetchFeed,
  createResponse
};
