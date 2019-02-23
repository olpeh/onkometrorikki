require('dotenv').config();

export const config = {
  twitterKeys: {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  },
  twitterConfig: {
    queryString: process.env.QUERY_STRING,
    resultType: process.env.RESULT_TYPE,
    language: process.env.TWITTER_LANG,
    username: process.env.TWITTER_USERNAME,
    check: parseInt(process.env.TWITTER_CHECK_RATE_SECONDS) * 1000,
    minInterval: parseInt(process.env.TWITTER_MIN_INTERVAL_SECONDS) * 1000,
    searchCount: process.env.TWITTER_SEARCH_COUNT,
    randomReply: process.env.RANDOM_REPLY,
    enabled: process.env.TWEETING_ENABLED || false
  }
};
