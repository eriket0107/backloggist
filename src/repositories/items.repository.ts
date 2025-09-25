import { Item, NewItem, ItemType, Genre } from "../types/index.js";

export interface ItemsRepository {
  create(data: Omit<NewItem, 'id'>): Promise<Item>;
  findById(id: string): Promise<Item | null>;
  findByType(type: ItemType): Promise<Item[]>;
  findByTitle(title: string): Promise<Item[]>;
  update(id: string, data: Partial<Omit<NewItem, 'id'>>): Promise<Item | undefined>;
  delete(id: string): Promise<void>;
  findAll(limit: number, offset: number): Promise<Item[]>;
  search(query: string): Promise<Item[]>;

  addGenreToItem(itemId: string, genreId: string): Promise<void>;
  removeGenreFromItem(itemId: string, genreId: string): Promise<void>;
  getItemGenres(itemId: string): Promise<Genre[]>;
  getItemsByGenre(genreId: string): Promise<Item[]>;
  getItemWithGenres(itemId: string): Promise<Item & { genres: Genre[] } | null>;
  updateItemGenres(itemId: string, genreIds: string[]): Promise<void>;
}

