import * as schema from './schema.js'

export type SelectProfile = typeof schema.profilesTable.$inferSelect;
export type InsertProfile = typeof schema.profilesTable.$inferInsert;

export type SelectSignedWithdrawal = typeof schema.signedWithdrawalsTable.$inferSelect;
export type InsertSignedWithdrawal = typeof schema.signedWithdrawalsTable.$inferInsert;