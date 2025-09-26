import { Injectable } from '@nestjs/common';
import { IItemsRepository, CreateItemData, UpdateItemData } from '@/repositories/interfaces/items.repository.interface';
import { Item } from '@/types/entities';

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

  async findAll(): Promise<Item[]> {
    return [...this.items];
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
