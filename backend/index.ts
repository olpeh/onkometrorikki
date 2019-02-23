const redisWrapper = require('./src/redisWrapper');
import { setUpApp } from './src/app';
import { setupTwitterBot } from './src/twitterBot';
import { setupTelegramBot } from './src/telegramBot';
const hsl = require('./src/hsl');

const CACHE_KEY = 'metro';
const port = process.env.PORT || 4000;
const cacheTtlSeconds = parseInt(process.env.CACHE_TTL_SECONDS) || 60;
const telegramBotToken = process.env.BOT_TOKEN;

const nodeEnv = process.env.NODE_ENV;

require('dotenv').config();

console.log('Initializing backend...');

let redisInstance = null;

if (nodeEnv === 'development') {
  console.log('Booting in dev mode, redis will be disabled');
} else {
  console.log('Booting in production mode');
  const redisInstance = redisWrapper.instance();
}

setUpApp(redisInstance, port, cacheTtlSeconds, CACHE_KEY, hsl);
setupTwitterBot(redisInstance, CACHE_KEY, cacheTtlSeconds, hsl);
setupTelegramBot(telegramBotToken, redisInstance, CACHE_KEY);
