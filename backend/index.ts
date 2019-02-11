const redisWrapper = require('./src/redisWrapper');
const app = require('./src/app');
const hsl = require('./src/hsl');
const twitterBot = require('./src/twitterBot');
const telegramBot = require('./src/telegramBot');

const CACHE_KEY = 'metro';
const port = process.env.PORT || 4000;
const cacheTtlSeconds = parseInt(process.env.CACHE_TTL_SECONDS) || 60;
const telegramBotToken = process.env.BOT_TOKEN;

require('dotenv').config();

console.log('Initializing backend...');
const redisInstance = redisWrapper.instance();
app.setUpApp(redisInstance, port, cacheTtlSeconds, CACHE_KEY);
twitterBot.setupTwitterBot(redisInstance, CACHE_KEY, cacheTtlSeconds);
telegramBot.setupTelegramBot(telegramBotToken, redisInstance, CACHE_KEY);
