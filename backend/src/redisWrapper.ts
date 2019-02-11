const redis = require('redis');
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

let redisClient;

const instance = () => {
  if (!redisClient) {
    // create a new redis client and connect to our local redis instance
    redisClient = redis.createClient({ url: redisUrl });
    // if an error occurs, print it to the console
    redisClient.on('error', err => console.error('Error ' + err));
  }

  return redisClient;
};

module.exports = {
  instance
};
