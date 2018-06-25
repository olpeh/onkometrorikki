const cors = require('@koa/cors');
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const route = require('koa-route');
const app = new koa();

const hsl = require('./hsl');
const bot = require('./bot');

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
      const failIfBroken = ctx.request.query.failIfBroken || undefined;
      await hsl
        .fetchFeed()
        .then(feed => {
          console.log('Got feed', feed);
          const dataToRespondWith = hsl.createResponse(feed, null);
          if (failIfBroken && dataToRespondWith.broken) {
            ctx.response.statusCode = 500;
          } else {
            ctx.response.statusCode = 200;
            ctx.response.body = dataToRespondWith;
          }
        })
        .catch(e => {
          console.log('Error in fetching data');
          console.error(e);
          const dataToRespondWith = hsl.createResponse(null, e);
          console.log('Error, going to respond with', dataToRespondWith);
          ctx.response.statusCode = 500;
          ctx.response.body = dataToRespondWith;
        });
    })
  );

  console.log('app listening on port ' + port);

  app.listen(port);
}

setUpApp();
bot.setup();
