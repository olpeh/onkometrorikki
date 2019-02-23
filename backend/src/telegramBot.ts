const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');

const setupTelegramBot = (botToken, redisClient, cacheKey) => {
  console.log('Setting up telegram bot', cacheKey, botToken);

  const keyboard = Markup.inlineKeyboard([
    Markup.urlButton('🌍', 'https://onkometrorikki.fi'),
    Markup.callbackButton('Päivitä ↺', 'refresh')
  ]);

  const replyWithStatus = reply =>
    redisClient.get(cacheKey, async (error, result) => {
      if (result) {
        console.log('Telegram bot is serving the response from cache');
        const status = JSON.parse(result);
        const question = 'Onko metro rikki? – ';
        if (status.broken) {
          reply(
            `${question} Kyllä!\n${status.reasons.join(',')}`,
            Extra.markup(keyboard)
          );
        } else {
          reply(`${question} Ei!`, Extra.markup(keyboard));
        }
      } else {
        console.warn(
          'Status was not found in cache, Telegram bot failed to serve status'
        );
        reply(
          'Jokin meni pieleen... Kokeile myöhemmin uudestaan tai vieraile https://onkometrorikki.fi sivulla.'
        );
      }
    });

  if (botToken) {
    const bot = new Telegraf(botToken);
    bot.start(ctx =>
      ctx.reply(
        'Terve. Olen onkometrorikki.fi botti. Lähetä komento /status nähdäksesi onko metro rikki tällä hetkellä.',
        Extra.markdown()
      )
    );

    bot.action('refresh', ({ reply, deleteMessage }) => {
      replyWithStatus(reply);
      deleteMessage();
    });

    bot.command('status', ctx => replyWithStatus(ctx.reply));
    bot.launch();
    console.log('Bot listening to messages and commands...');
  } else {
    console.warn('Telegram bot token was missing... ignoring');
  }
};

module.exports = {
  setupTelegramBot
};
