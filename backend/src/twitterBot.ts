const Twit = require('twit');
import { Option, none, some } from 'fp-ts/lib/Option';

const config = require('./config');
const hsl = require('./hsl');

const PREVIOUSLY_BROKEN_KEY = 'previously-broken';
const PREVIOUS_TWEET_TIME_KEY = 'previous-tweet-time';
const brokenStatusCacheTtlSeconds =
  process.env.STATUS_CACHE_TTL_SECONDS || 60 * 60 * 24;

let redisClient, bot, cacheKey, cacheTtl;

const setupTwitterBot = (
  redisInstance,
  cacheKeyParam,
  cacheTtlSecondsParam
) => {
  redisClient = redisInstance;
  bot = new Twit(config.twitterKeys);
  cacheKey = cacheKeyParam;
  cacheTtl = cacheTtlSecondsParam;
  console.log('Bot starting...');
  tweetIfBroken();
  setInterval(tweetIfBroken, config.twitterConfig.check);
};

const tweetNow = async (text, brokenNow) => {
  const tweet = {
    status: text
  };

  if (config.twitterConfig.enabled) {
    console.log('Going to try to tweet: ', text);
    bot.post('statuses/update', tweet, (err, data, response) => {
      if (err) {
        console.error('ERROR in tweeting!', err);
      } else {
        console.log('SUCCESS! tweeted: ', text);
        savePreviousTweetTime(new Date());
        saveBrokenStatus(brokenNow);
      }
    });
  } else {
    console.log('Tweeting was disabled, but would have tweeted:', {
      text,
      brokenNow
    });
    savePreviousTweetTime(new Date());
    saveBrokenStatus(brokenNow);
  }
};

const saveBrokenStatus = async brokenNow =>
  redisClient.setex(
    PREVIOUSLY_BROKEN_KEY,
    brokenStatusCacheTtlSeconds,
    brokenNow
  );

const getPreviousBrokenStatus = async (): Promise<boolean> =>
  new Promise((resolve, reject) => {
    redisClient.get(PREVIOUSLY_BROKEN_KEY, (error, result) => {
      console.log(getPreviousBrokenStatus, { result, error });
      if (error) {
        resolve(false);
      }
      resolve(result === 'true');
    });
  });

const savePreviousTweetTime = async previousTweetTime =>
  redisClient.setex(
    PREVIOUS_TWEET_TIME_KEY,
    brokenStatusCacheTtlSeconds,
    previousTweetTime.toString()
  );

const getPreviousTweetTime = async (): Promise<Option<Date>> =>
  new Promise((resolve, reject) => {
    redisClient.get(PREVIOUS_TWEET_TIME_KEY, (error, result) => {
      if (error) {
        resolve(none);
      }

      if (result !== null) {
        resolve(some(new Date(result)));
      }
      resolve(none);
    });
  });

const shouldTweetNow = async brokenNow =>
  new Promise(async (resolve, reject) => {
    const previouslyWasBroken = await getPreviousBrokenStatus();
    const previousTweetTime: Option<Date> = await getPreviousTweetTime();
    console.log({ previouslyWasBroken, previousTweetTime });

    if (brokenNow === true && previouslyWasBroken === false) {
      resolve(true);
    } else if (
      previouslyWasBroken === true &&
      brokenNow === false &&
      previousTweetTime !== null &&
      previousTweetTime.isSome() &&
      new Date().getTime() - previousTweetTime.value.getTime() >
        config.twitterConfig.minInterval
    ) {
      resolve(true);
    } else {
      resolve(false);
    }
  });

const tweetIfBroken = async () => {
  console.log('Checking if broken and tweeting maybe');
  await hsl
    .fetchFeed()
    .then(async feed => {
      const dataToRespondWith = hsl.createResponse(feed, null);

      // Update redis cache with the response
      redisClient.setex(
        cacheKey,
        cacheTtl,
        JSON.stringify(dataToRespondWith),
        () => console.log('Bot successfully updated cache')
      );

      const brokenNow = dataToRespondWith.broken;
      const shouldTweet = await shouldTweetNow(brokenNow);

      console.log('tweetIfBroken', { shouldTweet, brokenNow });
      if (shouldTweet) {
        console.log('Decided to tweet at', new Date());
        if (brokenNow) {
          const tweetText = `JUURI NYT – Metrossa häiriö:
${dataToRespondWith.reasons.join('')}
Katso: https://onkometrorikki.fi #länsimetro #hsl #metrohelsinki`;
          tweetNow(tweetText, brokenNow);
        } else {
          const timeNowStr = new Date().toLocaleTimeString();
          const tweetText = `JUURI NYT – Metro toimii jälleen! Katso: https://onkometrorikki.fi Kello on nyt ${timeNowStr}. #länsimetro #hsl #metrohelsinki`;
          tweetNow(tweetText, brokenNow);
        }
      } else {
        console.log('Decided not to tweet this time');
      }
    })
    .catch(e => {
      console.log('Error in fetching data');
      console.error(e);
    });
};

module.exports = { setupTwitterBot };
