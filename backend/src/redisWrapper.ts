const redis = require('redis');
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

let clientInstance;

const instance = () => {
  if (!clientInstance) {
    // create a new redis client and connect to our local redis instance
    clientInstance = redis.createClient({ url: redisUrl });
    // if an error occurs, print it to the console
    clientInstance.on('error', err => console.error('Error ' + err));
  }

  return clientInstance;
};

module.exports = {
  instance
};
