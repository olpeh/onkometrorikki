const http = require('http');
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const request = require('request');

module.exports = {
  fetchFeed: async function() {
    return new Promise((resolve, reject) => {
      const requestOptions = {
        method: 'GET',
        url: 'http://api.digitransit.fi/realtime/service-alerts/v1/',
        encoding: null
      };

      request(requestOptions, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          const feed = GtfsRealtimeBindings.FeedMessage.decode(body);
          resolve(feed);
        } else {
          reject(error);
        }
      });
    });
  },
  createResponse: function(feed, error) {
    console.log('Going to figure out what to respond');
    const defaultResponse = {
      success: true,
      broken: false,
      reasons: []
    };

    if (!feed) {
      console.log('No feed was provided...');
      return {
        ...defaultResponse,
        success: false,
        reasons: [
          ...defaultResponse.reasons,
          'Failed to fetch the feed.',
          'Failed to fetch the feed. The Metro might work or might not.'
        ],
        error
      };
    } else {
      console.log('Going to check if Metro is broken at the moment');
      let brokenCount = 0;
      let reasons = [];
      feed.entity.forEach(function(entity) {
        let thisAlertForBrokenMetro = false;
        if (entity.alert) {
          if (
            entity.alert &&
            entity.alert.informed_entity &&
            entity.alert.informed_entity.length > 0 &&
            (entity.alert.informed_entity[0].route_type ==
              METRO_ROUTE_TYPE_OLD ||
              entity.alert.informed_entity[0].route_type ==
                METRO_ROUTE_TYPE_NEW)
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
  }
};
