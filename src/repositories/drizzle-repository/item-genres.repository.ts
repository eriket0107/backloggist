import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/modules/database/database.service';
import { desc, eq, and } from 'drizzle-orm';
import { itemGenres, genres } from '../../../db/schema';
import { IItemGenresRepository, CreateItemGenreData } from '@/repositories/interfaces/item-genres.repository.interface';

@Injectable()
export class ItemGenresRepository implements IItemGenresRepository {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(itemGenreData: CreateItemGenreData) {
    const [itemGenre] = await this.databaseService.db
      .insert(itemGenres)
      .values(itemGenreData)
      .returning();
    return itemGenre;
  }

  async findAll({ limit = 10, page = 1 }: { limit?: number, page?: number }) {
    const offset = (page - 1) * limit;

    const itemGenreList = await this.databaseService.db
      .select()
      .from(itemGenres)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(itemGenres.id));

    const totalCount = await this.databaseService.db.$count(itemGenres);
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: itemGenreList,
      totalItems: totalCount,
      totalPages,
      currentPage: page,
      isFirstPage: page === 1,
      isLastPage: page >= totalPages,
    };
  }

  async findById(id: string) {
    const [itemGenre] = await this.databaseService.db
      .select()
      .from(itemGenres)
      .where(eq(itemGenres.id, id));
    return itemGenre || null;
  }

  async findByItemId(itemId: string) {
    const itemGenreList = await this.databaseService.db
      .select({
        id: itemGenres.id,
        itemId: itemGenres.itemId,
        genreId: itemGenres.genreId,
        genre: {
          id: genres.id,
          name: genres.name,
        }
      })
      .from(itemGenres)
      .innerJoin(genres, eq(itemGenres.genreId, genres.id))
      .where(eq(itemGenres.itemId, itemId));

    return itemGenreList.map(item => ({
      id: item.id,
      itemId: item.itemId,
      genreId: item.genreId,
      genre: item.genre
    }));
  }

  async findByGenreId(genreId: string) {
    const itemGenreList = await this.databaseService.db
      .select()
      .from(itemGenres)
      .where(eq(itemGenres.genreId, genreId));
    return itemGenreList;
  }

  async findByItemAndGenre(itemId: string, genreId: string) {
    const [itemGenre] = await this.databaseService.db
      .select()
      .from(itemGenres)
      .where(and(
        eq(itemGenres.itemId, itemId),
        eq(itemGenres.genreId, genreId)
      ));
    return itemGenre || null;
  }

  async delete(id: string) {
    const [itemGenre] = await this.databaseService.db
      .delete(itemGenres)
      .where(eq(itemGenres.id, id))
      .returning();
    return itemGenre || null;
  }

  async deleteByItemAndGenre(itemId: string, genreId: string) {
    const [itemGenre] = await this.databaseService.db
      .delete(itemGenres)
      .where(and(
        eq(itemGenres.itemId, itemId),
        eq(itemGenres.genreId, genreId)
      ))
      .returning();
    return itemGenre || null;
  }
}
