import { Bot } from 'grammy'
import { env } from './env.js';

const bot = new Bot(env.TELEGRAM_BOT_TOKEN)

// Basic command handlers
bot.command('start', (ctx) => {
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