import { integer, numeric, pgTable, text, varchar } from "drizzle-orm/pg-core";

import { timestamp } from "drizzle-orm/pg-core";

const timestamps = {
    updatedAt: timestamp(),
    createdAt: timestamp().defaultNow().notNull(),
}


export const profilesTable = pgTable("profiles", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().unique().notNull(),
    chatId: integer().notNull(),
    firstName: text(),
    lastName: text(),
    username: text(),
    walletAddress: text(),
    ...timestamps,
})

export const signedWithdrawalsTable = pgTable("signed_withdrawals", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    from: integer().references(() => profilesTable.id).notNull(),
    to: integer().references(() => profilesTable.id).notNull(),
    token: text().notNull(),
    unlockWithdrawalTime: timestamp(),
    deadline: timestamp().notNull(),
    withdrawAmount: text().notNull(),
    salt: text().notNull(),
    inputProof: text().notNull(),
    signature: text().notNull(),
    ...timestamps,
})