import { Item, NewItem, ItemType, Genre } from "../../types/index.js";
import { ItemsRepository } from "../items.repository.js";
import { randomUUID } from 'node:crypto';

interface ItemGenreRelation {
  id: string;
  itemId: string;
  genreId: string;
}

export class ItemsInMemoryRepository implements ItemsRepository {
  private items: Item[] = [];
  private itemGenres: ItemGenreRelation[] = [];
  private genres: Genre[] = [];

  constructor(genres: Genre[] = []) {
    this.genres = genres;
  }

  async create(data: Omit<NewItem, 'id'>): Promise<Item> {
    const item: Item = {
      id: randomUUID(),
      title: data.title,
      type: data.type,
      note: data.note || null,
      imgUrl: data.imgUrl || null,
    };

    this.items.push(item);
    return item;
  }

  async findById(id: string): Promise<Item | null> {
    const item = this.items.find(i => i.id === id);
    return item || null;
  }

  async findByType(type: ItemType): Promise<Item[]> {
    return this.items.filter(i => i.type === type);
  }

  async findByTitle(title: string): Promise<Item[]> {
    return this.items.filter(i =>
      i.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  async update(id: string, data: Partial<Omit<NewItem, 'id'>>): Promise<Item | undefined> {
    const itemIndex = this.items.findIndex(i => i.id === id);
    if (itemIndex === -1) {
      return undefined;
    }

    const updatedItem = {
      ...this.items[itemIndex],
      ...data,
    };

    this.items[itemIndex] = updatedItem;
    return updatedItem;
  }

  async delete(id: string): Promise<void> {
    const itemIndex = this.items.findIndex(i => i.id === id);
    if (itemIndex === -1) {
      return undefined;
    }

    this.itemGenres = this.itemGenres.filter(ig => ig.itemId !== id);
    this.items.splice(itemIndex, 1);
  }

  async findAll(): Promise<Item[]> {
    return [...this.items];
  }

  async search(query: string): Promise<Item[]> {
    const lowerQuery = query.toLowerCase();
    return this.items.filter(i =>
      i.title.toLowerCase().includes(lowerQuery) ||
      (i.note && i.note.toLowerCase().includes(lowerQuery))
    );
  }

  async addGenreToItem(itemId: string, genreId: string): Promise<void> {
    const existingRelation = this.itemGenres.find(
      ig => ig.itemId === itemId && ig.genreId === genreId
    );

    if (existingRelation) {
      return undefined;
    }

    const relation: ItemGenreRelation = {
      id: randomUUID(),
      itemId,
      genreId,
    };

    this.itemGenres.push(relation);
  }

  async removeGenreFromItem(itemId: string, genreId: string): Promise<void> {
    this.itemGenres = this.itemGenres.filter(
      ig => !(ig.itemId === itemId && ig.genreId === genreId)
    );
  }

  async getItemGenres(itemId: string): Promise<Genre[]> {
    const genreIds = this.itemGenres
      .filter(ig => ig.itemId === itemId)
      .map(ig => ig.genreId);

    return this.genres.filter(g => genreIds.includes(g.id));
  }

  async getItemsByGenre(genreId: string): Promise<Item[]> {
    const itemIds = this.itemGenres
      .filter(ig => ig.genreId === genreId)
      .map(ig => ig.itemId);

    return this.items.filter(i => itemIds.includes(i.id));
  }

  async getItemWithGenres(itemId: string): Promise<Item & { genres: Genre[] } | null> {
    const item = await this.findById(itemId);
    if (!item) {
      return null;
    }

    const genres = await this.getItemGenres(itemId);

    return {
      ...item,
      genres,
    };
  }

  async updateItemGenres(itemId: string, genreIds: string[]): Promise<void> {
    this.itemGenres = this.itemGenres.filter(ig => ig.itemId !== itemId);

    for (const genreId of genreIds) {
      await this.addGenreToItem(itemId, genreId);
    }
  }

  setGenres(genres: Genre[]): void {
    this.genres = genres;
  }
}
