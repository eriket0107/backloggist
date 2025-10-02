import { Item } from '@/types/entities';
import { PaginatedResult } from '@/types/pagination';

export interface CreateItemData {
  title: string;
  type: 'game' | 'book' | 'serie' | 'movie' | 'course';
  note?: string;
  imgUrl?: string;
}

export interface UpdateItemData {
  title?: string;
  type?: 'game' | 'book' | 'serie' | 'movie' | 'course';
  note?: string;
  imgUrl?: string;
  updatedAt?: Date;
}

export interface IItemsRepository {
  create(itemData: CreateItemData): Promise<Item>;
  findAll({ limit, page }: { limit?: number, page?: number }): Promise<PaginatedResult<Item>>;
  findById(id: string): Promise<Item | null>;
  update(id: string, itemData: UpdateItemData): Promise<Item | null>;
  delete(id: string): Promise<Item | null>;
}
