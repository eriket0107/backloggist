import { NewUserItem, UserItem, UserItemStatus } from "@/types";
import { UserItemsRepository } from "../userItems.repository";
import { DrizzleRepository } from "@/db";
import { userItemsTable } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";

class UserItemsDrizzleRepository implements UserItemsRepository {
  constructor(private repository: DrizzleRepository) { }

  async create(data: Omit<NewUserItem, "addedAt">): Promise<UserItem> {
    const [userItems] = await this.repository.insert(userItemsTable).values({
      ...data,
      addedAt: new Date()
    }).returning()

    return userItems
  }

  async findById(id: string): Promise<UserItem | null> {
    const [userItem] = await this.repository
      .select()
      .from(userItemsTable)
      .where(eq(userItemsTable.id, id))

    return userItem
  }
  async update(id: string, data: Partial<Omit<NewUserItem, "id" | "userId" | "itemId">>): Promise<UserItem | undefined> {
    const [userItem] = await this.repository.update(userItemsTable).set({ id, ...data }).returning()
    return userItem
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(userItemsTable).where(eq(userItemsTable.id, id))
  }
  async addItemToUserBacklog(userId: string, itemId: string, order?: number): Promise<UserItem | undefined> {
    const [userItem] = await this.repository.update(userItemsTable).set({ userId, itemId, order }).returning()

    return userItem
  }
  async removeItemFromUserBacklog(userId: string, itemId: string): Promise<void> {
    await this.repository.delete(userItemsTable).where(
      and(eq(userItemsTable.userId, userId), eq(userItemsTable.itemId, itemId))
    )
  }

  async getUserBacklog(userId: string): Promise<UserItem[]> {
    const userItem = await this.repository
      .select().from(userItemsTable)
      .where(eq(userItemsTable.userId, userId))

    return userItem
  }

  async getUserBacklogByStatus(userId: string, status: UserItemStatus): Promise<UserItem[]> {
    const userItem = await this.repository
      .select().from(userItemsTable)
      .where(and(eq(userItemsTable.userId, userId), eq(userItemsTable.status, status)))

    return userItem
  }

  async updateUserItemStatus(userId: string, itemId: string, status: UserItemStatus): Promise<UserItem | undefined> {
    const [userItem] = await this.repository.update(userItemsTable).set({ userId, itemId, status }).returning()

    return userItem
  }

  async updateUserItemRating(userId: string, itemId: string, rating: number): Promise<UserItem | undefined> {
    const [userItem] = await this.repository.update(userItemsTable).set({ userId, itemId, rating }).returning()

    return userItem
  }

  async updateUserItemOrder(userId: string, itemId: string, order: number): Promise<UserItem | undefined> {
    const [userItem] = await this.repository.update(userItemsTable).set({ userId, itemId, order }).returning()

    return userItem
  }

  async findUserItem(userId: string, itemId: string): Promise<UserItem | null> {
    const [userItem] = await this.repository
      .select().from(userItemsTable)
      .where(and(eq(userItemsTable.userId, userId), eq(userItemsTable.itemId, itemId)))

    return userItem
  }

  async getUserBacklogStats(userId: string): Promise<{
    status: "completed" | "in_progress" | "pending" | null;
    count: number;
  }[]> {
    const result = await this.repository
      .select({
        status: userItemsTable.status,
        count: count()
      })
      .from(userItemsTable)
      .where(eq(userItemsTable.userId, userId))
      .groupBy(userItemsTable.status)


    return result
  }
}

export { UserItemsDrizzleRepository }