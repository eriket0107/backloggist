import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/modules/database/database.service';
import { eq, and } from 'drizzle-orm';
import { userItemsTable, itemsTable } from '../../../db/schema';
import { IUserItemsRepository, CreateUserItemData, UpdateUserItemData } from '@/repositories/interfaces/user-items.repository.interface';
import { BacklogStats } from '@/types/entities';

@Injectable()
export class UserItemsRepository implements IUserItemsRepository {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(data: CreateUserItemData) {
    const [userItem] = await this.databaseService.db
      .insert(userItemsTable)
      .values(data)
      .returning();
    return userItem;
  }

  async findByUserId(userId: string) {
    return await this.databaseService.db
      .select({
        id: userItemsTable.id,
        userId: userItemsTable.userId,
        itemId: userItemsTable.itemId,
        order: userItemsTable.order,
        status: userItemsTable.status,
        rating: userItemsTable.rating,
        addedAt: userItemsTable.addedAt,
        item: {
          id: itemsTable.id,
          title: itemsTable.title,
          type: itemsTable.type,
          note: itemsTable.note,
          imgUrl: itemsTable.imgUrl,
        }
      })
      .from(userItemsTable)
      .innerJoin(itemsTable, eq(userItemsTable.itemId, itemsTable.id))
      .where(eq(userItemsTable.userId, userId));
  }

  async findByUserAndItem(userId: string, itemId: string) {
    const [userItem] = await this.databaseService.db
      .select()
      .from(userItemsTable)
      .where(and(
        eq(userItemsTable.userId, userId),
        eq(userItemsTable.itemId, itemId)
      ));
    return userItem || null;
  }

  async updateByUserAndItem(userId: string, itemId: string, userItemData: UpdateUserItemData) {
    const [userItem] = await this.databaseService.db
      .update(userItemsTable)
      .set(userItemData)
      .where(and(
        eq(userItemsTable.userId, userId),
        eq(userItemsTable.itemId, itemId)
      ))
      .returning();
    return userItem || null;
  }

  async deleteByUserAndItem(userId: string, itemId: string) {
    const [userItem] = await this.databaseService.db
      .delete(userItemsTable)
      .where(and(
        eq(userItemsTable.userId, userId),
        eq(userItemsTable.itemId, itemId)
      ))
      .returning();
    return userItem || null;
  }

  async getStatsByUserId(userId: string): Promise<BacklogStats> {
    const userItems = await this.databaseService.db
      .select({
        status: userItemsTable.status,
      })
      .from(userItemsTable)
      .where(eq(userItemsTable.userId, userId));

    return {
      total: userItems.length,
      completed: userItems.filter(item => item.status === 'completed').length,
      inProgress: userItems.filter(item => item.status === 'in_progress').length,
      pending: userItems.filter(item => item.status === 'pending').length,
    };
  }
}
