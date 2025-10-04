import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/modules/database/database.service';
import { eq, ilike } from 'drizzle-orm';
import { genresTable } from '../../../db/schema';
import { IGenresRepository, CreateGenreData, UpdateGenreData } from '@/repositories/interfaces/genres.repository.interface';

@Injectable()
export class GenresRepository implements IGenresRepository {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(genreData: CreateGenreData) {
    const [genre] = await this.databaseService.db
      .insert(genresTable)
      .values(genreData)
      .returning();
    return genre;
  }

  async findAll({ limit = 10, page = 1, search }: { limit?: number, page?: number, search: string }) {
    const offset = (page - 1) * limit;


    const genreList = await this.databaseService.db
      .select()
      .from(genresTable)
      .where(search && ilike(genresTable.name, `${search}%`))
      .limit(limit)
      .offset(offset)
      .orderBy(genresTable.name);

    const totalCount = await this.databaseService.db.$count(genresTable, search && ilike(genresTable.name, `${search}%`));
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: genreList,
      totalItems: totalCount,
      totalPages,
      currentPage: page,
      isFirstPage: page === 1,
      isLastPage: page >= totalPages,
    };
  }

  async findById(id: string) {
    const [genre] = await this.databaseService.db
      .select()
      .from(genresTable)
      .where(eq(genresTable.id, id));
    return genre || null;
  }

  async findByName(name: string) {
    const [genre] = await this.databaseService.db
      .select()
      .from(genresTable)
      .where(ilike(genresTable.name, name));
    return genre || null;
  }

  async update(id: string, genreData: UpdateGenreData) {
    const [genre] = await this.databaseService.db
      .update(genresTable)
      .set(genreData)
      .where(eq(genresTable.id, id))
      .returning();
    return genre || null;
  }

  async delete(id: string) {
    const [genre] = await this.databaseService.db
      .delete(genresTable)
      .where(eq(genresTable.id, id))
      .returning();
    return genre || null;
  }
}
