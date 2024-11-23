import { integer, numeric, pgTable, text, varchar } from "drizzle-orm/pg-core";

import { timestamp } from "drizzle-orm/pg-core";

const timestamps = {
    updatedAt: timestamp(),
    createdAt: timestamp().defaultNow().notNull(),
}


export const profilesTable = pgTable("profiles", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().notNull(),
    firstName: text(),
    lastName: text(),
    username: text(),
    walletAddress: text(),
    ...timestamps,
})

export const signedWithdrawalsTable = pgTable("signed_withdrawals", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    from: text(),
    to: text(),
    token: text(),
    unlockWithdrawalTime: numeric(),
    deadline: numeric(),
    withdrawAmount: text(),
    salt: text(),
    inputProof: text(),
    signature: text(),
    ...timestamps,
})