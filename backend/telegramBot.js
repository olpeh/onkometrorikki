const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
require('dotenv').config();

function setup(redisClient, cacheKey) {
  const botToken = process.env.BOT_TOKEN;
  console.log('Setting up telegram bot', cacheKey, botToken);
  if (botToken) {
    const bot = new Telegraf(botToken);
    bot.start(ctx =>
      ctx.reply(
        'Terve. Olen onkometrorikki.fi botti. Lähetä komento */status* nähdäksesi onko metro rikki tällä hetkellä.',
        Extra.markdown()
      )
    );

    bot.command('status', ctx => {
      redisClient.get(cacheKey, async (error, result) => {
        if (result) {
          console.log('Telegram bot is serving the response from cache');
          const status = JSON.parse(result);
          const question = 'Onko metro rikki?';
          if (status.broken) {
            ctx.reply(
              `${question} *Kyllä!* ${status.reasons.join(
                ','
              )} \n https://onkometrorikki.fi`,
              Extra.markdown()
            );
          } else {
            ctx.reply(
              `${question} *Ei!* \n https://onkometrorikki.fi`,
              Extra.markdown()
            );
          }
        } else {
          console.warn(
            'Status was not found in cache, Telegram bot failed to serve status'
          );
          ctx.reply(
            'Jokin meni pieleen... Kokeile myöhemmin uudestaan tai vieraile https://onkometrorikki.fi sivulla.'
          );
        }
      });
    });
    bot.startPolling();
  } else {
    console.warn('Telegram bot token was missing... ignoring');
  }
}

module.exports = {
  setup: setup
};
