import { Genre, NewGenre } from "../types/index.js";

export interface GenresRepository {
  create(data: Omit<NewGenre, 'id'>): Promise<Genre>;
  findById(id: string): Promise<Genre | null>;
  findByName(name: string): Promise<Genre | null>;
  update(id: string, data: Partial<Omit<NewGenre, 'id'>>): Promise<Genre | undefined>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Genre[]>;
  search(query: string): Promise<Genre[]>;
}
