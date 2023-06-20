import { setUpApp } from './src/app';
import { setupTwitterBot } from './src/twitterBot';
import { setupTelegramBot } from './src/telegramBot';
import { redisInstance } from './src/redisWrapper';

const CACHE_KEY = 'metro';
const port = process.env.PORT || 4000;
const cacheTtlSeconds = parseInt(process.env.CACHE_TTL_SECONDS) || 60;
const telegramBotToken = process.env.BOT_TOKEN;

const nodeEnv = process.env.NODE_ENV;

require('dotenv').config();

console.log('Initializing backend...');

let redis = null;

if (nodeEnv === 'development') {
  console.log('Booting in dev mode, redis will be disabled');
} else {
  console.log('Booting in production mode');
  if (process.env.REDIS_ENABLED === 'true') {
    redis = redisInstance();
  }
}

setUpApp(redis, port, cacheTtlSeconds, CACHE_KEY);
setupTwitterBot(redis, CACHE_KEY, cacheTtlSeconds);
setupTelegramBot(telegramBotToken, redis, CACHE_KEY);
