import type { InsertProfile, InsertSignedWithdrawal, SelectProfile } from "./types.js";
import { db } from "./db.js";
import * as schema from './schema.js'
import { desc, eq } from "drizzle-orm";

export const findProfileById = async (id: number) => {
    const res = await db.select().from(schema.profilesTable).where(eq(schema.profilesTable.id, id))
    return res.at(0)
}

export type BaseUser = Pick<InsertProfile, "userId" | "chatId" | "username" | "firstName" | "lastName">

export const createBaseUser = async (data: BaseUser) => {
    return db.insert(schema.profilesTable).values(data).onConflictDoNothing().returning()
}

export type SetupUserWalletArgs = Pick<SelectProfile, "id" | "walletAddress">

export const setupUserWalletArgs = async (data: SetupUserWalletArgs) => {
    return db.update(schema.profilesTable).set({ walletAddress: data.walletAddress }).where(eq(schema.profilesTable.userId, data.id)).returning()
}

export const getUserProfileByUsername = async (username: string) => {
    const res = await db.select().from(schema.profilesTable).where(eq(schema.profilesTable.username, username))
    return res.at(0)
}

export const createSignedWithdrawal = async (data: InsertSignedWithdrawal) => {
    return db.insert(schema.signedWithdrawalsTable).values(data).returning()
}

interface GetPaginatedUserSignedWithdrawalsPaginatedArgs {
    userId: number,
    page: number,
    pageSize: number,
}

export const getPaginatedUserSignedWithdrawals = async ({ userId, page, pageSize }: GetPaginatedUserSignedWithdrawalsPaginatedArgs) => {
    const offset = (page - 1) * pageSize;

    const data = await db
        .select()
        .from(schema.signedWithdrawalsTable)
        .where(eq(schema.signedWithdrawalsTable.from, userId))
        .orderBy(
            desc(schema.signedWithdrawalsTable.createdAt)
        )
        .limit(pageSize)
        .offset(offset);

    return data;
}

export const deleteSignedWithdrawal = async (id: number) => {
    db.delete(schema.signedWithdrawalsTable).where(eq(schema.signedWithdrawalsTable.id, id))
}