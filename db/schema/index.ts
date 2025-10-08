import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";



export const usersTable = table("users", {
  id: t.text().primaryKey().notNull().default(sql`gen_random_uuid()`),
  name: t.varchar({ length: 150 }).notNull(),
  email: t.varchar({ length: 100 }).notNull().unique(),
  password: t.varchar({ length: 150 }).notNull(),
  createdAt: t.timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: t.timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
  return {
    emailIdx: t.uniqueIndex('email_idx').on(table.email)
  }
});

export const sessionsTable = table('sessions', {
  id: t.text().primaryKey().notNull().default(sql`gen_random_uuid()`),
  userId: t.text('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  accessToken: t.text('access_token').notNull(),
  isExpired: t.boolean('is_expired').default(false),
  expiredAt: t.timestamp('expired_at'),
  createdAt: t.timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
},
)

export const itemsTable = table('items', {
  id: t.text().primaryKey().notNull().default(sql`gen_random_uuid()`),
  title: t.varchar({ length: 200 }).notNull(),
  type: t.varchar({ length: 200, enum: ['game', 'book', 'serie', 'movie', 'course'] }).notNull(),
  note: t.text(),
  imgUrl: t.text("img_url"),
  createdAt: t.timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: t.timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),

}, (table) => {
  return {
    typeIdx: t.index('type_idx').on(table.type)
  }
});

export const userItemsTable = table('userItems', {
  id: t.text().primaryKey().notNull().default(sql`gen_random_uuid()`),
  userId: t.text('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  itemId: t.text('item_id').notNull().references(() => itemsTable.id, { onDelete: 'cascade' }),
  order: t.integer(), //decimal
  status: t.varchar({ length: 100, enum: ['completed', 'in_progress', 'pending'] }),
  rating: t.integer(), //decimal
  addedAt: t.timestamp('added_at').notNull(),
  createdAt: t.timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: t.timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
  return {
    userIdx: t.index('user_idx').on(table.userId),
    itemIdx: t.index('item_idx').on(table.itemId),
    statusIdx: t.index('status_idx').on(table.status),
    userItemIdx: t.uniqueIndex('user_item_unique_idx').on(table.userId, table.itemId),
  }
});

export const genresTable = table('genres', {
  id: t.text().primaryKey().notNull().default(sql`gen_random_uuid()`),
  name: t.varchar({ length: 100 }).notNull().unique(),
},
  (table) => {
    return {
      genreNameIdx: t.index('genre_name_idx').on(table.name),
    }
  }
)

export const itemGenresTable = table('itemGenres', {
  id: t.text().primaryKey().notNull().default(sql`gen_random_uuid()`),
  itemId: t.text('item_id').notNull().references(() => itemsTable.id, { onDelete: 'cascade' }),
  genreId: t.text('genre_id').notNull().references(() => genresTable.id, { onDelete: 'cascade' }),
  createdAt: t.timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: t.timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
  return {
    itemIdx: t.index('item_genre_idx').on(table.itemId),
    genreIdx: t.index('genre_idx').on(table.genreId),
  }
})