import type { CommandContext, Context } from "grammy";

import { env } from './env.js'
import type { SelectSignedWithdrawal } from "./db/types.js";
import dayjs from 'dayjs'

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

const formatDate = (date: Date | string) => {
    return dayjs(date).format("D/MM/YYYY HH:mm")
}

export const formatSignedWithdrawal = (withdrawal: SelectSignedWithdrawal) => {
    const formattedUnlockWithdrawalTime = withdrawal.unlockWithdrawalTime ? formatDate(withdrawal.unlockWithdrawalTime) : undefined;
    const formattedDeadline = formatDate(withdrawal.deadline);

    return `
Recepient              | ${withdrawal.to}${formattedUnlockWithdrawalTime ? `\nUnlock withdrawal time | ${formattedUnlockWithdrawalTime}` : ""}
Deadline               | ${formattedDeadline}
Token                  | USDC
`
}