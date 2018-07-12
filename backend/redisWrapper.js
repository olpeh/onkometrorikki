const redis = require('redis');
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const cacheTtlSeconds = process.env.CACHE_TTL_SECONDS || 60;

let redisClient;

function instance() {
  if (!redisClient) {
    // create a new redis client and connect to our local redis instance
    redisClient = redis.createClient({ url: redisUrl });
    // if an error occurs, print it to the console
    redisClient.on('error', err => console.error('Error ' + err));
  }

  return redisClient;
}

module.exports = {
  instance: instance
};
