import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { userItemsTable } from "db/schema";

export enum UserItemStatus {
  COMPLETED = 'completed',
  IN_PROGRESS = 'in_progress',
  PENDING = 'pending'
}

export type UserItem = InferSelectModel<typeof userItemsTable>;
export type NewUserItem = InferInsertModel<typeof userItemsTable>;
