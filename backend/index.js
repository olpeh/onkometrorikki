const cors = require('@koa/cors');
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const route = require('koa-route');
const app = new koa();
const redis = require('redis');
const cacheControl = require('koa-cache-control');

const hsl = require('./hsl');
const bot = require('./bot');

require('dotenv').config();

app.use(cors());
app.use(bodyParser());

const port = process.env.PORT || 3000;
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const cacheTtlSeconds = process.env.CACHE_TTL_SECONDS || 60;
app.use(
  cacheControl({
    maxAge: cacheTtlSeconds
  })
);

const CACHE_KEY = 'lansimetro';

console.log({ port, redisUrl, cacheTtlSeconds });

// create a new redis client and connect to our local redis instance
const redisClient = redis.createClient({ url: redisUrl });

// if an error occurs, print it to the console
redisClient.on('error', err => console.error('Error ' + err));

async function setUpApp() {
  app.use(
    route.get('/api/isitbroken', async ctx => {
      try {
        await new Promise(resolve => {
          const failIfBroken = ctx.request.query.failIfBroken || undefined;
          redisClient.get(CACHE_KEY, async (error, result) => {
            if (result && !failIfBroken) {
              ctx.response.statusCode = 200;
              ctx.response.body = JSON.parse(result);
              resolve();
            } else {
              await hsl
                .fetchFeed()
                .then(async feed => {
                  console.log('Got feed', feed);
                  const dataToRespondWith = hsl.createResponse(feed, null);
                  await redisClient.setex(
                    CACHE_KEY,
                    cacheTtlSeconds,
                    JSON.stringify(dataToRespondWith)
                  );

                  if (failIfBroken && dataToRespondWith.broken) {
                    ctx.response.statusCode = 500;
                    resolve();
                  } else {
                    ctx.response.statusCode = 200;
                    ctx.response.body = dataToRespondWith;
                    resolve();
                  }
                })
                .catch(e => {
                  console.log('Error in fetching data');
                  console.error(e);
                  const dataToRespondWith = hsl.createResponse(null, e);
                  console.log(
                    'Error, going to respond with',
                    dataToRespondWith
                  );
                  ctx.response.statusCode = 500;
                  ctx.response.body = dataToRespondWith;
                });
            }
          });
        });
      } catch (e) {
        console.log('Error');
        console.error(e);
        ctx.response.statusCode = 500;
        ctx.response.body = e;
      }
    })
  );

  console.log('app listening on port ' + port);

  app.listen(port);
}

setUpApp();
bot.setup();
