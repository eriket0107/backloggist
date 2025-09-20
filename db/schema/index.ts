import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";


export const usersTable = table("users", {
  id: t.text().primaryKey().notNull(),
  name: t.text({ length: 150 }).notNull(),
  email: t.text({ length: 100 }).notNull().unique(),
  password: t.text({ length: 150 }).notNull(),
  createdAt: t.int('created_at', { mode: 'timestamp' }).default(sql`(current_timestamp)`),
  updatedAt: t.int('updated_at', { mode: 'timestamp' }).default(sql`(current_timestamp)`),
}, (table) => {
  return {
    emailIdx: t.uniqueIndex('email_idx').on(table.email)
  }
});

export const itemsTable = table('items', {
  id: t.text().primaryKey().notNull(),
  title: t.text({ length: 200 }).notNull(),
  type: t.text({ length: 200, enum: ['game', 'book', 'serie', 'movie'] }).notNull(),
  note: t.text(),
  imgUrl: t.text("img_url")
}, (table) => {
  return {
    typeIdx: t.index('type_idx').on(table.type)
  }
});

export const userItemsTable = table('userItems', {
  id: t.text().primaryKey().notNull(),
  userId: t.text('user_id').unique().references(() => usersTable.id),
  itemId: t.text('item_id').unique().references(() => itemsTable.id),
  order: t.int({ mode: 'number' }), //decimal
  status: t.text({ length: 100, enum: ['completed', 'in_progress', 'pending'] }),
  ranting: t.int({ mode: 'number' }), //decimal
  addedAt: t.int('added_at', { mode: 'timestamp' }).notNull(),
}, (table) => {
  return {
    userIdx: t.index('user_idx').on(table.userId),
    itemIdx: t.index('item_idx').on(table.itemId),
    statusIdx: t.index('status_idx').on(table.status),
    userItemIdx: t.uniqueIndex('user_item_unique_idx').on(table.userId, table.itemId),
  }
});


export const genres = table('genres', {
  id: t.text().primaryKey().notNull(),
  name: t.text({ length: 100 }).notNull(),
})

export const itemGenres = table('itemGenres', {
  id: t.text().primaryKey().notNull(),
  itemId: t.text('item_id').notNull(),
  genreId: t.text('genre_id').notNull(),
}, (table) => {
  return {
    itemIdx: t.index('item_genre_idx').on(table.itemId),
    genreIdx: t.index('genre_idx').on(table.genreId),
  }
})