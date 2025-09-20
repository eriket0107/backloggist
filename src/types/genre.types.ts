import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { genres } from "db/schema";

export type Genre = InferSelectModel<typeof genres>;
export type NewGenre = InferInsertModel<typeof genres>;
