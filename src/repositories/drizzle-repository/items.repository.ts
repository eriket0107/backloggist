import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/modules/database/database.service';
import { desc, eq, or, and, count } from 'drizzle-orm';
import { itemsTable } from '../../../db/schema';
import { IItemsRepository, CreateItemData, UpdateItemData } from '@/repositories/interfaces/items.repository.interface';

@Injectable()
export class ItemsRepository implements IItemsRepository {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(itemData: CreateItemData) {
    const [item] = await this.databaseService.db
      .insert(itemsTable)
      .values(itemData)
      .returning();
    return item;
  }

  async findAll({ limit = 10, page = 1, userId }: { limit?: number, page?: number, userId: string }) {
    const offset = (page - 1) * limit;

    const whereCondition = and(
      eq(itemsTable.userId, userId),
      eq(itemsTable.isPublic, false)
    );

    const [{ totalItems: totalCount }] = await this.databaseService.db
      .select({ totalItems: count() })
      .from(itemsTable)
      .where(whereCondition);

    const items = await this.databaseService.db
      .select()
      .from(itemsTable)
      .where(whereCondition)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(itemsTable.createdAt));

    const totalPages = Math.ceil(totalCount / limit)

    return {
      data: items,
      totalItems: totalCount,
      totalPages,
      currentPage: page,
      isFirstPage: page === 1,
      isLastPage: page >= totalPages,
    };
  }

  async findById(id: string, userId: string) {
    const whereCondition = and(
      eq(itemsTable.id, id),
      or(
        eq(itemsTable.userId, userId),
        eq(itemsTable.isPublic, false)
      )
    );

    const [item] = await this.databaseService.db
      .select()
      .from(itemsTable)
      .where(whereCondition);
    return item || null;
  }

  async update(id: string, itemData: UpdateItemData) {
    const [item] = await this.databaseService.db
      .transaction(async () =>
        await this.databaseService.db
          .update(itemsTable)
          .set(itemData)
          .where(eq(itemsTable.id, id))
          .returning()
        , {
          isolationLevel: "read committed",
          accessMode: "read write",
          deferrable: true
        });
    return item || null;
  }

  async delete(id: string) {
    const [item] = await this.databaseService.db
      .transaction(async () =>
        await this.databaseService.db
          .delete(itemsTable)
          .where(eq(itemsTable.id, id))
          .returning());

    return item || null;
  }
}
