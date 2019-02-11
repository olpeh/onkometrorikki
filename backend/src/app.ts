const cors = require('@koa/cors');
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const route = require('koa-route');
const cacheControl = require('koa-cache-control');

module.exports = {
  setUpApp: (redisClient, port, cacheTtlSeconds, cacheKey) => {
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
      route.get('/isitbroken', async ctx => {
        try {
          await new Promise(resolve => {
            const failIfBroken = ctx.request.query.failIfBroken || undefined;
            redisClient.get(cacheKey, async (error, result) => {
              if (result && !failIfBroken) {
                console.log('Response was served from the cache');
                ctx.response.statusCode = 200;
                ctx.response.body = JSON.parse(result);
                resolve();
              } else {
                await hsl
                  .fetchFeed()
                  .then(async feed => {
                    const dataToRespondWith = hsl.createResponse(feed, null);
                    await redisClient.setex(
                      cacheKey,
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

    app.use(
      route.get('/hsl/debug', async ctx => {
        try {
          const weakSecret = ctx.request.query.weakSecret || null;
          const correctWeakSecret =
            process.env.DEBUG_WEAK_SECRET || 'länsimetro';
          if (weakSecret !== correctWeakSecret) {
            throw 'Not allowed';
          }
          await new Promise(resolve => {
            hsl
              .fetchFeed()
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
  }
};
