const Twit = require('twit');
const config = require('./config');
const hsl = require('./hsl');
const redisWrapper = require('./redisWrapper');

const PREVIOUSLY_BROKEN_KEY = 'previously-broken';
const PREVIOUS_TWEET_TIME_KEY = 'previous-tweet-time';
const brokenStatusCacheTtlSeconds =
  process.env.STATUS_CACHE_TTL_SECONDS || 60 * 60 * 24;

const redisClient = redisWrapper.instance();

let bot, cacheKey, cacheTtlSeconds;

function setup(cacheKeyParam, cacheTtlSecondsParam) {
  bot = new Twit(config.twitterKeys);
  cacheKey = cacheKeyParam;
  cacheTtlSeconds = cacheTtlSecondsParam;
  console.log('Bot starting...');
  tweetIfBroken();
  setInterval(tweetIfBroken, config.twitterConfig.check);
}

async function tweetNow(text, brokenNow) {
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
}

const saveBrokenStatus = async brokenNow =>
  redisClient.setex(
    PREVIOUSLY_BROKEN_KEY,
    brokenStatusCacheTtlSeconds,
    brokenNow
  );

const getPreviousBrokenStatus = async () =>
  new Promise((resolve, reject) => {
    redisClient.get(PREVIOUSLY_BROKEN_KEY, (error, result) => {
      console.log(getPreviousBrokenStatus, { result });
      resolve(result === 'true');
    });
  });

const savePreviousTweetTime = async previousTweetTime =>
  redisClient.setex(
    PREVIOUS_TWEET_TIME_KEY,
    brokenStatusCacheTtlSeconds,
    previousTweetTime.toString()
  );

const getPreviousTweetTime = async () =>
  new Promise((resolve, reject) => {
    redisClient.get(PREVIOUS_TWEET_TIME_KEY, (error, result) => {
      if (result !== null) {
        resolve(new Date(result));
      }
      resolve(null);
    });
  });

const shouldTweetNow = async brokenNow =>
  new Promise(async (resolve, reject) => {
    const previouslyWasBroken = await getPreviousBrokenStatus();
    const previousTweetTime = await getPreviousTweetTime();
    console.log({ previouslyWasBroken, previousTweetTime });

    if (
      brokenNow === true &&
      previouslyWasBroken === false &&
      previousTweetTime === null
    ) {
      resolve(true);
    } else if (
      brokenNow === true &&
      previouslyWasBroken === false &&
      previousTweetTime !== null &&
      new Date() - previousTweetTime > config.twitterConfig.minInterval
    ) {
      resolve(true);
    } else if (previouslyWasBroken === true && brokenNow === false) {
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
        cacheTtlSeconds,
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

module.exports = {
  setup: setup
};
