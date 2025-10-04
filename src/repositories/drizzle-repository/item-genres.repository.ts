import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/modules/database/database.service';
import { eq, and, asc } from 'drizzle-orm';
import { itemGenresTable, genresTable, itemsTable } from '../../../db/schema';
import { IItemGenresRepository, CreateItemGenreData } from '@/repositories/interfaces/item-genres.repository.interface';


@Injectable()
export class ItemGenresRepository implements IItemGenresRepository {
  constructor(private readonly databaseService: DatabaseService) { }
  async create(itemGenreData: CreateItemGenreData) {
    const [itemGenre] = await this.databaseService.db
      .insert(itemGenresTable)
      .values(itemGenreData)
      .returning();
    return itemGenre;
  }

  async findAll({ limit = 10, page = 1, genreId, itemId }: { limit?: number, page?: number, genreId?: string, itemId?: string }) {
    const offset = (page - 1) * limit;

    const itemGenreList = await this.databaseService.db
      .select({
        id: itemGenresTable.id,
        itemId: itemGenresTable.itemId,
        genreId: itemGenresTable.genreId,
        createdAt: itemGenresTable.createdAt,
        updatedAt: itemGenresTable.updatedAt,
        itemTitle: itemsTable.title,
        genreName: genresTable.name,
      })
      .from(itemGenresTable)
      .innerJoin(itemsTable, eq(itemGenresTable.itemId, itemsTable.id))
      .innerJoin(genresTable, eq(itemGenresTable.genreId, genresTable.id))
      .where(and(itemId && eq(itemGenresTable.itemId, itemId), genreId && eq(itemGenresTable.genreId, genreId)))
      .limit(limit)
      .offset(offset)

    const totalCount = itemGenreList.length
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
      .select({
        id: itemGenresTable.id,
        genreId: genresTable.id,
        genreName: genresTable.name,
        itemId: itemsTable.id,
        itemTitle: itemsTable.title,
      })
      .from(itemGenresTable)
      .innerJoin(itemsTable, eq(itemGenresTable.itemId, itemsTable.id))
      .innerJoin(genresTable, eq(itemGenresTable.genreId, genresTable.id))
      .where(eq(itemGenresTable.id, id));

    return itemGenre || null;
  }

  async findByItemId(itemId: string) {
    const itemGenreList = await this.databaseService.db
      .select({
        id: itemGenresTable.id,
        genreId: genresTable.id,
        genreName: genresTable.name,
      })
      .from(itemGenresTable)
      .innerJoin(genresTable, eq(itemGenresTable.genreId, genresTable.id))
      .where(eq(itemGenresTable.itemId, itemId))
      .orderBy(asc(genresTable.name));

    return itemGenreList
  }

  async findByGenreId(genreId: string) {
    const itemGenreList = await this.databaseService.db
      .select({
        id: itemGenresTable.id,
        itemId: itemsTable.id,
        itemTitle: itemsTable.title,
      })
      .from(itemGenresTable)
      .innerJoin(itemsTable, eq(itemGenresTable.itemId, itemsTable.id))
      .where(eq(itemGenresTable.genreId, genreId));
    return itemGenreList;
  }

  async findByItemAndGenre(itemId: string, genreId: string) {
    const [itemGenre] = await this.databaseService.db
      .select()
      .from(itemGenresTable)
      .where(and(eq(itemGenresTable.itemId, itemId), eq(itemGenresTable.genreId, genreId)));
    return itemGenre || null;
  }


  async delete(id: string) {
    const [itemGenre] = await this.databaseService.db
      .delete(itemGenresTable)
      .where(eq(itemGenresTable.id, id))
      .returning();
    return itemGenre || null;
  }
}
