const cors = require('@koa/cors');
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const route = require('koa-route');
const cacheControl = require('koa-cache-control');
import { createResponse, fetchFeed } from './hsl';

const respondFromHSL = async (
  ctx,
  resolve,
  failIfBroken,
  redisClient,
  cacheKey,
  cacheTtlSeconds
) =>
  await fetchFeed()
    .then(async feed => {
      const dataToRespondWith = createResponse(feed);

      if (redisClient) {
        await redisClient.setex(
          cacheKey,
          cacheTtlSeconds,
          JSON.stringify(dataToRespondWith)
        );
      }

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
      // 502 Bad Gateway
      // The server was acting as a gateway or proxy and received an invalid
      // response from the upstream server.
      ctx.response.statusCode = 503;
      ctx.response.body = e;
    });

export const setUpApp = (redisClient, port, cacheTtlSeconds, cacheKey) => {
  console.log('Starting app...', { port, cacheTtlSeconds });

  const app = new koa();
  app.use(cors());
  app.use(bodyParser());

  app.use(
    cacheControl({
      maxAge: cacheTtlSeconds
    })
  );

  app.use(
    route.get('/status', async ctx => {
      try {
        await new Promise(resolve => {
          const failIfBroken = ctx.request.query.failIfBroken || undefined;
          if (redisClient) {
            redisClient.get(cacheKey, async (error, result) => {
              if (result && !failIfBroken) {
                console.log('Response was served from the cache');
                ctx.response.statusCode = 200;
                ctx.response.body = JSON.parse(result);
                resolve();
              } else {
                await respondFromHSL(
                  ctx,
                  resolve,
                  failIfBroken,
                  redisClient,
                  cacheKey,
                  cacheTtlSeconds
                );
              }
            });
          } else {
            console.log('Redis unavailable, responding with data from HSL');
            respondFromHSL(
              ctx,
              resolve,
              failIfBroken,
              redisClient,
              cacheKey,
              cacheTtlSeconds
            );
          }
        });
      } catch (e) {
        console.log('Error');
        console.error(e);
        ctx.response.statusCode = 500;
        ctx.response.body = e;
      }
    })
  );

  app.use(
    route.get('/hsl/debug', async ctx => {
      try {
        const weakSecret = ctx.request.query.weakSecret || null;
        const correctWeakSecret = process.env.DEBUG_WEAK_SECRET || 'länsimetro';
        if (weakSecret !== correctWeakSecret) {
          throw 'Not allowed';
        }
        await new Promise(resolve => {
          fetchFeed()
            .then(async feed => {
              ctx.response.statusCode = 200;
              ctx.response.body = feed;
              resolve();
            })
            .catch(e => {
              console.log('Error in fetching data');
              console.error(e);
              ctx.response.statusCode = 500;
              ctx.response.body = e;
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
  return app;
};
