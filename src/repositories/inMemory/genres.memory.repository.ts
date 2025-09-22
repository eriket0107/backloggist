import { Genre, NewGenre } from "../../types/index.js";
import { GenresRepository } from "../genres.repository.js";
import { randomUUID } from 'node:crypto';

export class GenresInMemoryRepository implements GenresRepository {
  private genres: Genre[] = [];

  async create(data: Omit<NewGenre, 'id'>): Promise<Genre> {
    const genre: Genre = {
      ...data,
      id: randomUUID(),
    };

    this.genres.push(genre);
    return genre;
  }

  async findById(id: string): Promise<Genre | null> {
    const genre = this.genres.find(g => g.id === id);
    return genre || null;
  }

  async findByName(name: string): Promise<Genre | null> {
    const genre = this.genres.find(g =>
      g.name.toLowerCase() === name.toLowerCase()
    );
    return genre || null;
  }

  async update(id: string, data: Partial<Omit<NewGenre, 'id'>>): Promise<Genre> {
    const genreIndex = this.genres.findIndex(g => g.id === id);
    if (genreIndex === -1) {
      throw new Error(`Genre with id ${id} not found`);
    }

    const updatedGenre = {
      ...this.genres[genreIndex],
      ...data,
    };

    this.genres[genreIndex] = updatedGenre;
    return updatedGenre;
  }

  async delete(id: string): Promise<void> {
    const genreIndex = this.genres.findIndex(g => g.id === id);
    if (genreIndex === -1) {
      throw new Error(`Genre with id ${id} not found`);
    }

    this.genres.splice(genreIndex, 1);
  }

  async findAll(): Promise<Genre[]> {
    return [...this.genres];
  }

  async search(query: string): Promise<Genre[]> {
    const lowerQuery = query.toLowerCase();
    return this.genres.filter(g =>
      g.name.toLowerCase().includes(lowerQuery)
    );
  }
}
