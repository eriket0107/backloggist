import { Injectable } from '@nestjs/common';
import { Genre } from '@/types/entities';
import { IGenresRepository, CreateGenreData, UpdateGenreData } from '@/repositories/interfaces/genres.repository.interface';

@Injectable()
export class GenresMemoryRepository implements IGenresRepository {
  private genres: Genre[] = [];
  private nextId = 1;

  async create(genreData: CreateGenreData): Promise<Genre> {
    const genre: Genre = {
      id: (this.nextId++).toString(),
      name: genreData.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.genres.push(genre);
    return genre;
  }

  async findAll({ limit = 10, page = 1 }: { limit?: number, page?: number }) {
    const offset = (page - 1) * limit;
    const sortedGenres = [...this.genres].sort((a, b) => a.name.localeCompare(b.name));
    const paginatedGenres = sortedGenres.slice(offset, offset + limit);

    const totalItems = this.genres.length;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: paginatedGenres,
      totalItems,
      totalPages,
      currentPage: page,
      isFirstPage: page === 1,
      isLastPage: page >= totalPages,
    };
  }

  async findById(id: string): Promise<Genre | null> {
    return this.genres.find(genre => genre.id === id) || null;
  }

  async findByName(name: string): Promise<Genre | null> {
    return this.genres.find(genre => genre.name.toLowerCase() === name.toLowerCase()) || null;
  }

  async update(id: string, genreData: UpdateGenreData): Promise<Genre | null> {
    const genreIndex = this.genres.findIndex(genre => genre.id === id);
    if (genreIndex === -1) return null;

    this.genres[genreIndex] = {
      ...this.genres[genreIndex],
      ...genreData,
      updatedAt: new Date(),
    };

    return this.genres[genreIndex];
  }

  async delete(id: string): Promise<Genre | null> {
    const genreIndex = this.genres.findIndex(genre => genre.id === id);
    if (genreIndex === -1) return null;

    const deletedGenre = this.genres[genreIndex];
    this.genres.splice(genreIndex, 1);
    return deletedGenre;
  }
}
