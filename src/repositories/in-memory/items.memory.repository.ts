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
      description: itemData.description,
      imgUrl: itemData.imgUrl,
      userId: itemData.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.push(item);
    this.nextId++;
    return item;
  }

  async findAll({ limit, page, userId }: { limit?: number, page?: number, userId: string }): Promise<PaginatedResult<Item>> {
    const filteredItems = this.items.filter(item => item.userId === userId);
    const totalItems = filteredItems.length;
    const currentPage = page || 1;
    const itemsPerPage = limit || totalItems;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const data = [...filteredItems].slice(startIndex, endIndex);

    return {
      data,
      totalItems,
      totalPages,
      currentPage,
      isFirstPage: currentPage === 1,
      isLastPage: currentPage === totalPages || totalPages === 0,
    };
  }

  async findById(id: string, userId: string): Promise<Item | null> {
    return this.items.find(item => item.id === id && item.userId === userId) || null;
  }

  async update(id: string, itemData: UpdateItemData): Promise<Item | null> {
    const itemIndex = this.items.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return null;
    }

    this.items[itemIndex] = {
      ...this.items[itemIndex],
      ...itemData,
      updatedAt: new Date(),
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
