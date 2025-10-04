import { Injectable } from '@nestjs/common';
import { ItemGenre, ItemGenreWithDetails, Genre } from '@/types/entities';
import { IItemGenresRepository, CreateItemGenreData } from '@/repositories/interfaces/item-genres.repository.interface';

@Injectable()
export class ItemGenresMemoryRepository implements IItemGenresRepository {
  private itemGenres: ItemGenre[] = [];
  private genres: Genre[] = [];
  private nextId = 1;

  async create(itemGenreData: CreateItemGenreData): Promise<ItemGenre> {
    const itemGenre: ItemGenre = {
      id: (this.nextId++).toString(),
      itemId: itemGenreData.itemId,
      genreId: itemGenreData.genreId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.itemGenres.push(itemGenre);
    return itemGenre;
  }

  async findAll({ limit = 10, page = 1 }: { limit?: number, page?: number }) {
    const offset = (page - 1) * limit;
    const paginatedItemGenres = this.itemGenres.slice(offset, offset + limit);

    const totalItems = this.itemGenres.length;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: paginatedItemGenres,
      totalItems,
      totalPages,
      currentPage: page,
      isFirstPage: page === 1,
      isLastPage: page >= totalPages,
    };
  }

  async findById(id: string): Promise<ItemGenre | null> {
    return this.itemGenres.find(itemGenre => itemGenre.id === id) || null;
  }

  async findByItemId(itemId: string): Promise<ItemGenreWithDetails[]> {
    const itemGenreList = this.itemGenres.filter(itemGenre => itemGenre.itemId === itemId);

    return itemGenreList.map(itemGenre => {
      const genre = this.genres.find(g => g.id === itemGenre.genreId);
      return {
        id: itemGenre.id,
        itemId: itemGenre.itemId,
        genreId: itemGenre.genreId,
        genre: genre || {
          id: itemGenre.genreId,
          name: 'Unknown',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        createdAt: itemGenre.createdAt,
        updatedAt: itemGenre.updatedAt,
      };
    });
  }

  async findByGenreId(genreId: string): Promise<ItemGenre[]> {
    return this.itemGenres.filter(itemGenre => itemGenre.genreId === genreId);
  }

  async findByItemAndGenre(itemId: string, genreId: string): Promise<ItemGenre | null> {
    return this.itemGenres.find(itemGenre =>
      itemGenre.itemId === itemId && itemGenre.genreId === genreId
    ) || null;
  }

  async delete(id: string): Promise<ItemGenre | null> {
    const itemGenreIndex = this.itemGenres.findIndex(itemGenre => itemGenre.id === id);
    if (itemGenreIndex === -1) return null;

    const deletedItemGenre = this.itemGenres[itemGenreIndex];
    this.itemGenres.splice(itemGenreIndex, 1);
    return deletedItemGenre;
  }
  // Helper method to set genres for better mock data (not part of interface)
  setGenres(genres: Genre[]): void {
    this.genres = genres;
  }
}
