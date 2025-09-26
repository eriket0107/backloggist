import { Item } from '@/types/entities';

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
}

export interface IItemsRepository {
  create(itemData: CreateItemData): Promise<Item>;
  findAll(): Promise<Item[]>;
  findById(id: string): Promise<Item | null>;
  update(id: string, itemData: UpdateItemData): Promise<Item | null>;
  delete(id: string): Promise<Item | null>;
}
