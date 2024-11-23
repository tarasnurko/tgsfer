import type { CommandContext, Context } from "grammy";

import { env } from './env.js'

const setUpWalletUrl = `${env.TELEGRAM_MINI_APP_URL}/setup-wallet`

export const sendBotStartMessage = async (ctx: CommandContext<Context>) => {
    return ctx.reply('Welcome to Tgsfer Bot! This bot allow user to manage encrypted token transfers using fhevm (on z1labs). Click button to set up your wallet', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Set up wallet', url: setUpWalletUrl }]
            ]
        }
    });
}