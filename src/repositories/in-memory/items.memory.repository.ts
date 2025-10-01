import { Injectable } from '@nestjs/common';
import { IItemsRepository, CreateItemData, UpdateItemData } from '@/repositories/interfaces/items.repository.interface';
import { Item } from '@/types/entities';
import { PaginatedResult } from '@/types/pagination';

@Injectable()
export class ItemsMemoryRepository implements IItemsRepository {
  private items: Item[] = [];
  private nextId = 1;

  async create(itemData: CreateItemData): Promise<Item> {
    const item: Item = {
      id: this.nextId.toString(),
      title: itemData.title,
      type: itemData.type,
      note: itemData.note,
      imgUrl: itemData.imgUrl,
    };

    this.items.push(item);
    this.nextId++;
    return item;
  }

  async findAll({ limit, page }: { limit?: number, page?: number } = {}): Promise<PaginatedResult<Item>> {
    const totalItems = this.items.length;
    const currentPage = page || 1;
    const itemsPerPage = limit || totalItems;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const data = [...this.items].slice(startIndex, endIndex);

    return {
      data,
      totalItems,
      totalPages,
      currentPage,
      isFirstPage: currentPage === 1,
      isLastPage: currentPage === totalPages || totalPages === 0,
    };
  }

  async findById(id: string): Promise<Item | null> {
    return this.items.find(item => item.id === id) || null;
  }

  async update(id: string, itemData: UpdateItemData): Promise<Item | null> {
    const itemIndex = this.items.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return null;
    }

    this.items[itemIndex] = {
      ...this.items[itemIndex],
      ...itemData,
    };

    return this.items[itemIndex];
  }

  async delete(id: string): Promise<Item | null> {
    const itemIndex = this.items.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return null;
    }

    const deletedItem = this.items[itemIndex];
    this.items.splice(itemIndex, 1);
    return deletedItem;
  }
}
