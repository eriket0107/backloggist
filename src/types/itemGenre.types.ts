import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { itemGenres } from "db/schema";

export type ItemGenre = InferSelectModel<typeof itemGenres>;
export type NewItemGenre = InferInsertModel<typeof itemGenres>;
