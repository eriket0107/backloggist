import { Item } from '@/types/entities';
import { PaginatedResult } from '@/types/pagination';

export interface CreateItemData {
  userId: string;
  title: string;
  type: 'game' | 'book' | 'serie' | 'movie' | 'course';
  description?: string;
  imgUrl?: string;
}

export interface UpdateItemData {
  title?: string;
  type?: 'game' | 'book' | 'serie' | 'movie' | 'course';
  description?: string;
  imgUrl?: string;
  updatedAt?: Date;
}

export interface IItemsRepository {
  create(itemData: CreateItemData): Promise<Item>;
  findAll({ limit, page, userId }: { limit?: number, page?: number, userId: string }): Promise<PaginatedResult<Item>>;
  findById(id: string, userId: string): Promise<Item | null>;
  update(id: string, itemData: UpdateItemData): Promise<Item | null>;
  delete(id: string): Promise<Item | null>;
  // saveFile(file: Express.Multer.File): Promise<void>
}
