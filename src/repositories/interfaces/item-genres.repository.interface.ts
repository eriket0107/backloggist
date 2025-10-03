import { ItemGenre, ItemGenreWithDetails } from '@/types/entities';
import { PaginatedResult } from '@/types/pagination';

export interface CreateItemGenreData {
  itemId: string;
  genreId: string;
}

export interface IItemGenresRepository {
  create(itemGenreData: CreateItemGenreData): Promise<ItemGenre>;
  findAll({ limit, page }: { limit?: number, page?: number }): Promise<PaginatedResult<ItemGenre>>;
  findById(id: string): Promise<ItemGenre | null>;
  findByItemId(itemId: string): Promise<ItemGenreWithDetails[]>;
  findByGenreId(genreId: string): Promise<ItemGenre[]>;
  findByItemAndGenre(itemId: string, genreId: string): Promise<ItemGenre | null>;
  delete(id: string): Promise<ItemGenre | null>;
  deleteByItemAndGenre(itemId: string, genreId: string): Promise<ItemGenre | null>;
}
