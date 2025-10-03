import { Genre } from '@/types/entities';
import { PaginatedResult } from '@/types/pagination';

export interface CreateGenreData {
  name: string;
}

export interface UpdateGenreData {
  name?: string;
}

export interface IGenresRepository {
  create(genreData: CreateGenreData): Promise<Genre>;
  findAll({ limit, page }: { limit?: number, page?: number }): Promise<PaginatedResult<Genre>>;
  findById(id: string): Promise<Genre | null>;
  findByName(name: string): Promise<Genre | null>;
  update(id: string, genreData: UpdateGenreData): Promise<Genre | null>;
  delete(id: string): Promise<Genre | null>;
}
