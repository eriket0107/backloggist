import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/modules/database/database.service';
import { eq } from 'drizzle-orm';
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

  async findAll() {
    return await this.databaseService.db
      .select()
      .from(itemsTable);
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
      .update(itemsTable)
      .set(itemData)
      .where(eq(itemsTable.id, id))
      .returning();
    return item || null;
  }

  async delete(id: string) {
    const [item] = await this.databaseService.db
      .delete(itemsTable)
      .where(eq(itemsTable.id, id))
      .returning();
    return item || null;
  }
}
