import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/modules/database/database.service';
import { desc, eq } from 'drizzle-orm';
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

  async findAll({ limit = 10, page = 1 }: { limit?: number, page?: number }) {
    const offset = (page - 1) * limit;

    const items = await this.databaseService.db
      .select()
      .from(itemsTable)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(itemsTable.createdAt));

    const totalCount = await this.databaseService.db.$count(itemsTable)
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

  async findById(id: string) {
    const [item] = await this.databaseService.db
      .select()
      .from(itemsTable)
      .where(eq(itemsTable.id, id));
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
