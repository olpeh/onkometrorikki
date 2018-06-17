const cors = require('@koa/cors');
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const route = require('koa-route');
const app = new koa();
const http = require('http');
const parseString = require('xml2js').parseString;
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const request = require('request');

require('dotenv').config();

/*
Deprecated Types
The values below are retained for backwards-compatibility with existing feeds;
feed-reading applications should continue to understand these, but they shouldn't be used in new feeds.
https://sites.google.com/site/gtfschanges/proposals/route-type

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

app.use(cors());
app.use(bodyParser());

const port = process.env.PORT || 3000;
console.log(process.env.PORT);

async function setUpApp() {
  app.use(
    route.get('/api/isitbroken', async ctx => {
      console.log('Got the request');
      await fetchFeed()
        .then(feed => {
          const dataToRespondWith = createResponse(feed, null);
          console.log('Success, going to respond with', dataToRespondWith);
          ctx.response.statusCode = 200;
          ctx.response.body = dataToRespondWith;
        })
        .catch(e => {
          console.log('Error in fetching data');
          console.error(e);
          const dataToRespondWith = createResponse(null, e);
          console.log('Error, going to respond with', dataToRespondWith);
          ctx.response.statusCode = 500;
          ctx.response.body = dataToRespondWith;
        });
    })
  );

  console.log('app listening on port ' + port);

  app.listen(port);
}

const fetchFeed = async () =>
  new Promise((resolve, reject) => {
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

const createResponse = (feed, error) => {
  console.log('Going to figure out what to respond');
  const defaultResponse = {
    success: true,
    broken: false,
    reasons: ['Only god knows']
  };

  if (!feed) {
    console.log('No feed was provided...');
    return {
      ...defaultResponse,
      success: false,
      reasons: [
        ...defaultResponse.reasons,
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

  return response;
};

setUpApp();
