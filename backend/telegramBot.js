const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
require('dotenv').config();

function setup(redisClient, cacheKey) {
  const botToken = process.env.BOT_TOKEN;
  console.log('Setting up telegram bot', cacheKey, botToken);
  if (botToken) {
    const bot = new Telegraf(botToken);
    bot.start(ctx =>
      ctx.reply(
        'Terve. Olen onkometrorikki.fi botti. Lähetä komento /status nähdäksesi onko metro rikki tällä hetkellä.',
        Extra.markdown()
      )
    );

    const keyboard = Markup.inlineKeyboard([
      Markup.urlButton('🌍', 'https://onkometrorikki.fi'),
      Markup.callbackButton('Päivitä', 'status')
    ]);

    bot.command('status', ctx => {
      redisClient.get(cacheKey, async (error, result) => {
        if (result) {
          console.log('Telegram bot is serving the response from cache');
          const status = JSON.parse(result);
          const question = 'Onko metro rikki? – ';
          if (status.broken) {
            ctx.reply(
              `${question} Kyllä!\n ${status.reasons.join(',')}`,
              Extra.markup(keyboard)
            );
          } else {
            ctx.reply(`${question} Ei!`, Extra.markup(keyboard));
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
    bot.launch();
    console.log('Bot listening to messages and commands...');
  } else {
    console.warn('Telegram bot token was missing... ignoring');
  }
}

module.exports = {
  setup: setup
};
