const Twit = require('twit');
const config = require('./config');
const hsl = require('./hsl');
const param = config.twitterConfig;

let bot;

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
    }
  });
}

const tweetIfBroken = async () => {
  console.log('Checking if broken and tweeting maybe');
  await hsl
    .fetchFeed()
    .then(feed => {
      const dataToRespondWith = hsl.createResponse(feed, null);
      if (dataToRespondWith.broken) {
        const tweetText = `
          Länsimetrossa häiriö:
          ${dataToRespondWith.reasons.join('')}
          Katso: https://onkolansimetrorikki.now.sh/
          `;
        tweetNow(tweetText);
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
