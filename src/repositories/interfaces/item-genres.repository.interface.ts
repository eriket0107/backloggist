import { ItemGenre, ItemGenreWithDetails } from '@/types/entities';
import { PaginatedResult } from '@/types/pagination';

export interface CreateItemGenreData {
  itemId: string;
  genreId: string;
}

export interface IItemGenresRepository {
  create(itemGenreData: CreateItemGenreData): Promise<ItemGenre>;
  findAll({ limit, page, genreId, itemId }: { limit?: number, page?: number, genreId?: string, itemId?: string }): Promise<PaginatedResult<ItemGenre>>;
  findById(id: string): Promise<ItemGenre | null>;
  findByItemId(itemId: string): Promise<Partial<ItemGenreWithDetails>[]>;
  findByGenreId(genreId: string): Promise<Partial<ItemGenre>[]>;
  findByItemAndGenre(itemId: string, genreId: string): Promise<ItemGenre | null>;
  delete(id: string): Promise<ItemGenre | null>;
}
