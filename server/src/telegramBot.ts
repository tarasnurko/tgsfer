import { Bot, InlineKeyboard } from 'grammy'
import { env } from './env.js';
import { createBaseUser, findProfileById, getPaginatedUserSignedWithdrawals } from './db/repository.js'
import { formatSignedWithdrawal, sendBotStartMessage } from './helpers.js';

const bot = new Bot(env.TELEGRAM_BOT_TOKEN)

// Basic command handlers
bot.command('start', async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) {
        ctx.reply('Can not start, userId is not available');
        return
    }

    await createBaseUser({ userId, chatId: ctx.chatId, username: ctx.from?.username, firstName: ctx.from?.first_name, lastName: ctx.from?.last_name });

    await sendBotStartMessage(ctx)
});

bot.command('setup-wallet', async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) {
        return
    }
    await sendBotStartMessage(ctx)
})

bot.command('signatures', async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) {
        return
    }

    const [signedWithdrawal] = await getPaginatedUserSignedWithdrawals({ userId, page: 0, pageSize: 1 })

    const keyboard = new InlineKeyboard()
        .text('Delete', `delete_withdrawal:${signedWithdrawal.id}`).text('Next', `withdrawals?page=${1}`)

    const formattedSignedWithdrawal = formatSignedWithdrawal(signedWithdrawal)

    await ctx.reply(formattedSignedWithdrawal, {
        reply_markup: keyboard
    });
})

// bot.command('help', (ctx) => {
//     ctx.reply('Use /start to start the bot and /help to see this message.');
// });


export { bot }