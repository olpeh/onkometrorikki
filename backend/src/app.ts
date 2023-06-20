const cors = require('@koa/cors');
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const route = require('koa-route');
const cacheControl = require('koa-cache-control');
import { createResponse, fetchFeed } from './hsl';
import { postSlackMessage } from './slack';
const slackToken = process.env.SLACK_BOT_TOKEN;

const seenEventIds: string[] = [];

const eventSeenBefore = (id: string) => seenEventIds.includes(id);

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
      ctx.response.statusCode = 502;
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
                resolve(undefined);
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
        // 502 Bad Gateway
        // The server was acting as a gateway or proxy and received an invalid
        // response from the upstream server.
        ctx.response.statusCode = 502;
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
              resolve(undefined);
            })
            .catch(e => {
              console.log('Error in fetching data');
              console.error(e);
              // 502 Bad Gateway
              // The server was acting as a gateway or proxy and received an invalid
              // response from the upstream server.
              ctx.response.statusCode = 502;
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

  app.use(
    route.post('/slack/actions', async ctx => {
      const payload = ctx.request.body;
      // Assume success, set to error in case of error
      ctx.response.statusCode = 200;

      if (payload.type === 'url_verification') {
        // TODO: verify this
        // Once you receive the event, verify the request's authenticity and
        // then respond in plaintext with the challenge attribute value
        ctx.response.body = payload.challenge;
        return;
      } else if (
        (payload.event.type === 'app_mention' ||
          payload.event.type === 'message') &&
        (typeof payload.event.subtype === 'undefined' ||
          // Don't react to messages sent by a bot (this bot for example!)
          (payload.event.subtype && payload.event.subtype !== 'bot_message'))
      ) {
        if (eventSeenBefore(payload.event.client_msg_id)) {
          console.log(
            `Event with id: ${
              payload.event.client_msg_id
            } has been seen before, ignoring....`
          );
          return;
        }

        seenEventIds.push(payload.event.client_msg_id);
        /*
          See https://api.slack.com/events/app_mention
              https://api.slack.com/events/message.im
          */
        console.log('Slack bot received', payload);

        if (!slackToken) {
          const errorMessage =
            'Slack token missing! Ignoring Slack event received';
          console.warn(errorMessage);
          ctx.response.statusCode = 500;
          ctx.response.body = errorMessage;
          return;
        }

        if (redisClient) {
          redisClient.get(cacheKey, async (error, result) => {
            let answer = '42';
            if (result) {
              console.log('Slack bot is serving the response from cache', {
                error,
                result
              });
              const status = JSON.parse(result);
              const question = 'Onko metro rikki? – ';
              if (status.broken) {
                // TODO: add I18N and reuse implementation between bots
                const finnishReason = status.reasons[0][0].text;
                answer = `${question} Kyllä!\n${finnishReason}`;
              } else {
                answer = `${question} Ei!`;
              }
            } else {
              console.warn(
                'Status was not found in cache, Slack bot failed to serve status'
              );
              answer =
                'Jokin meni pieleen... Kokeile myöhemmin uudestaan tai vieraile https://onkometrorikki.fi sivulla.';
            }

            postSlackMessage({
              channel: payload.event.channel,
              text: answer,
              token: slackToken
            });
          });
        } else {
          const msg =
            'Redis not available, ignoring app_mention due to performance reasons';
          console.warn(msg);
          postSlackMessage({
            channel: payload.event.channel,
            text: msg,
            token: slackToken
          });
        }
      } else {
        console.warn('Unknown payload, ignoring');
      }
    })
  );

  app.use(
    route.post('/slack/commands', async ctx => {
      ctx.response.statusCode = 200;

      const payload = ctx.request.body;

      if (payload.command === '/onkometrorikki') {
        if (redisClient) {
          // TODO: Horrible duplicate code. PLZ fix
          await new Promise(resolve => {
            redisClient.get(cacheKey, async (error, result) => {
              let answer = '42';
              if (result) {
                console.log('Slack bot is serving the response from cache', {
                  error,
                  result
                });
                const status = JSON.parse(result);
                const question = 'Onko metro rikki? – ';
                if (status.broken) {
                  // TODO: add I18N and reuse implementation between bots
                  const finnishReason = status.reasons[0][0].text;
                  answer = `${question} Kyllä!\n${finnishReason}`;
                } else {
                  answer = `${question} Ei!`;
                }
              } else {
                console.warn(
                  'Status was not found in cache, Slack bot failed to serve status'
                );
                answer =
                  'Jokin meni pieleen... Kokeile myöhemmin uudestaan tai vieraile https://onkometrorikki.fi sivulla.';
              }
              ctx.response.body = answer;
              resolve(undefined);
            });
          });
        } else {
          const msg =
            'Redis not available, ignoring /onkometrorikki due to performance reasons';
          console.warn(msg);
          ctx.response.body = msg;
        }
      }
    })
  );

  app.use(
    route.post('/slack/morko', async ctx => {
      ctx.response.statusCode = 200;
      ctx.response.body = 'Kyllä! Mörkö!';
    })
  );

  console.log('app listening on port ' + port);

  app.listen(port);
  return app;
};
