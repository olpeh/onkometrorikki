const Twit = require('twit');
const config = require('./config');
const hsl = require('./hsl');

let bot;
let previousTweetTime;
let previouslyWasBroken = false;

function setup() {
  bot = new Twit(config.twitterKeys);
  console.log('Bot starting...');
  tweetIfBroken();
  setInterval(tweetIfBroken, config.twitterConfig.check);
}

function tweetNow(text) {
  const tweet = {
    status: text
  };

  bot.post('statuses/update', tweet, (err, data, response) => {
    if (err) {
      console.error('ERROR,', err);
    } else {
      console.log('SUCCESS: tweeted: ', text);
      previousTweetTime = new Date();
    }
  });
}

const shouldTweetNow = brokenNow => {
  if (!previouslyWasBroken && brokenNow && !previousTweetTime) {
    return true;
  } else if (previouslyWasBroken && !brokenNow) {
    return true;
  } else if (
    previousTweetTime &&
    new Date() - previousTweetTime > config.twitterConfig.minInterval
  ) {
    return true;
  }
  return false;
};

const tweetIfBroken = async () => {
  console.log('Checking if broken and tweeting maybe');
  await hsl
    .fetchFeed()
    .then(feed => {
      const dataToRespondWith = hsl.createResponse(feed, null);
      if (shouldTweetNow(dataToRespondWith.broken)) {
        console.log('Decided to tweet at', new Date());
        if (dataToRespondWith.broken) {
          const tweetText = `
          Länsimetrossa häiriö:
          ${dataToRespondWith.reasons.join('')}
          Katso: https://onkolansimetrorikki.now.sh/
          `;
          previouslyWasBroken = true;
          tweetNow(tweetText);
        } else {
          const tweetText = `
          Länsimetro toimii jälleen!
          Katso: https://onkolansimetrorikki.now.sh/
          `;
          previouslyWasBroken = false;
          tweetNow(tweetText);
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
