import { itemsTable } from "db/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export enum ItemType {
  GAME = 'game',
  BOOK = 'book',
  SERIE = 'serie',
  MOVIE = 'movie'
}

export type Item = InferSelectModel<typeof itemsTable>;
export type NewItem = InferInsertModel<typeof itemsTable>;
