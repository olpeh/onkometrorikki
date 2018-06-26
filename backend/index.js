const cors = require('@koa/cors');
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const route = require('koa-route');
const app = new koa();

const hsl = require('./hsl');
const bot = require('./bot');

require('dotenv').config();

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
