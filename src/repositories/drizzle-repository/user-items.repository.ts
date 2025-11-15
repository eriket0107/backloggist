import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/modules/database/database.service';
import { eq, and, count, ilike } from 'drizzle-orm';
import { userItemsTable, itemsTable } from '../../../db/schema';
import { IUserItemsRepository, CreateUserItemData, UpdateUserItemData } from '@/repositories/interfaces/user-items.repository.interface';
import { BacklogStats, Item, UserItemWithDetails } from '@/types/entities';
import { PaginatedResult } from '@/types/pagination';

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

  async findByBacklogByUser({ userId, limit = 10, page = 1, search, type }: { limit?: number, page?: number, userId: string, type?: Item['type'], search?: string }): Promise<PaginatedResult<UserItemWithDetails>> {
    const offset = (page - 1) * limit;

    const [{ totalItems: totalCount }] = await this.databaseService.db
      .select({ totalItems: count() })
      .from(userItemsTable)
      .innerJoin(itemsTable, eq(userItemsTable.itemId, itemsTable.id))
      .where(and(eq(userItemsTable.userId, userId), type && eq(itemsTable.type, type), search && ilike(itemsTable.title, `${search}%`)))

    const backlog = await this.databaseService.db
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
          userId: itemsTable.userId,
          title: itemsTable.title,
          type: itemsTable.type,
          description: itemsTable.description,
          imgUrl: itemsTable.imgUrl,
          createdAt: itemsTable.createdAt,
          updatedAt: itemsTable.updatedAt,
        }
      })
      .from(userItemsTable)
      .innerJoin(itemsTable, eq(userItemsTable.itemId, itemsTable.id))
      .where(and(eq(userItemsTable.userId, userId), type && eq(itemsTable.type, type), search && ilike(itemsTable.title, `${search}%`)))
      .offset(offset)
      .limit(limit);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: backlog as UserItemWithDetails[],
      totalItems: totalCount,
      totalPages,
      currentPage: page,
      isFirstPage: page === 1,
      isLastPage: page === totalPages,
    }
  }

  async findByUserAndItem({ id, userId }: { userId: string, id: string }) {
    const [userItem] = await this.databaseService.db
      .select()
      .from(userItemsTable)
      .where(and(
        eq(userItemsTable.userId, userId),
        eq(userItemsTable.itemId, id)
      ));
    return userItem || null;
  }

  async updateByUserAndItem(userId: string, userItemId: string, userItemData: UpdateUserItemData) {
    const [userItem] = await this.databaseService.db
      .update(userItemsTable)
      .set(userItemData)
      .where(and(
        eq(userItemsTable.userId, userId),
        eq(userItemsTable.id, userItemId)
      ))
      .returning();
    return userItem || null;
  }

  async deleteByUserAndItem(userId: string, id: string) {
    const [userItem] = await this.databaseService.db
      .delete(userItemsTable)
      .where(and(
        eq(userItemsTable.userId, userId),
        eq(userItemsTable.id, id)
      ))
      .returning();
    return userItem || null;
  }

  async getStatsByUserId(userId: string): Promise<BacklogStats> {
    const [{ total }] = await this.databaseService.db
      .select({ total: count() })
      .from(userItemsTable)
      .where(eq(userItemsTable.userId, userId));

    const statusesCount = await this.databaseService.db
      .select({
        status: userItemsTable.status,
        count: count()
      })
      .from(userItemsTable)
      .groupBy(userItemsTable.status)

    const statusCount = statusesCount.reduce((acc, { status, count }) => {
      acc[status] = count

      return acc
    }, {
      completed: 0,
      in_progress: 0,
      pending: 0,
    } as Record<UserItemWithDetails['status'], number>)

    return {
      total,
      ...statusCount,
    };
  }
}
