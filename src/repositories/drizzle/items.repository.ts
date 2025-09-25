import { NewItem, Item, ItemType, Genre } from "@/types";
import { ItemsRepository } from "../items.repository";
import { DrizzleRepository } from "@/db";
import { itemsTable, itemGenres, genres } from "@/db/schema";
import { asc, eq, like } from "drizzle-orm";

class ItemsDrizzleRepository implements ItemsRepository {
  constructor(private repository: DrizzleRepository) { }

  async create(data: Omit<NewItem, "id">): Promise<Item> {
    const [item] = await this.repository.insert(itemsTable).values(data).returning()
    return item
  }

  async findById(id: string): Promise<Item | null> {
    const [item] = await this.repository.select().from(itemsTable).where(eq(itemsTable.id, id))
    return item
  }

  async findByType(type: ItemType): Promise<Item[]> {
    const items = await this.repository.select().from(itemsTable).where(eq(itemsTable.type, type))
    return items
  }

  async findByTitle(title: string): Promise<Item[]> {
    const items = await this.repository.select().from(itemsTable).where(eq(itemsTable.title, title))
    return items
  }

  async update(id: string, data: Partial<Omit<NewItem, "id">>): Promise<Item | undefined> {
    const [item] = await this.repository.update(itemsTable).set({ id, ...data }).returning()
    return item
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(itemsTable).where(eq(itemsTable.id, id))
  }

  async findAll(limit: number, offset: number): Promise<Item[]> {
    const items = await this.repository.select().from(itemsTable).limit(limit).offset(offset).orderBy(asc(itemsTable.title))
    return items
  }

  async search(query: string): Promise<Item[]> {
    const items = await this.repository.select().from(itemsTable).where(like(itemsTable.title, query))
    return items
  }

  async addGenreToItem(itemId: string, genreId: string): Promise<void> {
    await this.repository.insert(itemGenres).values({ itemId, genreId })
  }

  async removeGenreFromItem(itemId: string, genreId: string): Promise<void> {
    await this.repository.insert(itemGenres).values({ itemId, genreId })
  }

  async getItemGenres(itemId: string): Promise<Genre[]> {
    const result = await this.repository
      .select({ id: genres.id, name: genres.name, item: itemsTable.title })
      .from(genres)
      .leftJoin(itemGenres, eq(itemGenres.genreId, genres.id))
      .where(eq(itemGenres.itemId, itemId))
    return result
  }

  async getItemsByGenre(genreId: string): Promise<Item[]> {
    const result = await this.repository
      .select({
        id: itemsTable.id,
        title: itemsTable.title,
        type: itemsTable.type,
        note: itemsTable.note,
        imgUrl: itemsTable.imgUrl
      })
      .from(itemsTable)
      .innerJoin(itemGenres, eq(itemGenres.itemId, itemsTable.id))
      .where(eq(itemGenres.genreId, genreId))

    return result
  }

  async updateItemGenres(itemId: string, genreIds: string[]): Promise<void> {
    await this.repository.update(itemGenres).set({ itemId, ...genreIds })
  }

  async getItemWithGenres(itemId: string): Promise<(Item & { genres: Genre[]; }) | null> {
    const item = await this.repository
      .select()
      .from(itemsTable)
      .where(eq(itemsTable.id, itemId))
      .limit(1)

    if (!item[0]) return null

    const itemGenres = await this.getItemGenres(itemId)

    return { ...item[0], genres: itemGenres }
  }
}

export { ItemsDrizzleRepository }