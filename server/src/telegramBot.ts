import { Bot } from 'grammy'
import { env } from './env.js';
import { createBaseUser } from './db/repository.js'

const bot = new Bot(env.TELEGRAM_BOT_TOKEN)

// Basic command handlers
bot.command('start', async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) {
        ctx.reply('Can not start, userId is not available');
        return
    }

    await createBaseUser({ userId, username: ctx.from?.username, firstName: ctx.from?.first_name, lastName: ctx.from?.last_name });

    ctx.reply('Welcome! This bot uses Hono and grammY.js.');
});

bot.command('help', (ctx) => {
    ctx.reply('Use /start to start the bot and /help to see this message.');
});

// Echo handler for any text message
bot.on('message:text', (ctx) => {
    ctx.reply(`You said: ${ctx.message.text}`);
});

export { bot }