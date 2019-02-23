const redisWrapper = require('./src/redisWrapper');
const app = require('./src/app');
const hsl = require('./src/hsl');
const twitterBot = require('./src/twitterBot');
const telegramBot = require('./src/telegramBot');

const CACHE_KEY = 'metro';
const port = process.env.PORT || 4000;
const cacheTtlSeconds = parseInt(process.env.CACHE_TTL_SECONDS) || 60;
const telegramBotToken = process.env.BOT_TOKEN;

const nodeEnv = process.env.NODE_ENV;

require('dotenv').config();

console.log('Initializing backend...');

if (nodeEnv === 'development') {
  console.log('Booting in dev mode, redis will be disabled');
  const redisInstance = null;
  app.setUpApp(redisInstance, port, cacheTtlSeconds, CACHE_KEY, hsl);
  twitterBot.setupTwitterBot(redisInstance, CACHE_KEY, cacheTtlSeconds, hsl);
  telegramBot.setupTelegramBot(telegramBotToken, redisInstance, CACHE_KEY);
} else {
  console.log('Booting in production mode');
  const redisInstance = redisWrapper.instance();
  app.setUpApp(redisInstance, port, cacheTtlSeconds, CACHE_KEY, hsl);
  twitterBot.setupTwitterBot(redisInstance, CACHE_KEY, cacheTtlSeconds, hsl);
  telegramBot.setupTelegramBot(telegramBotToken, redisInstance, CACHE_KEY);
}
