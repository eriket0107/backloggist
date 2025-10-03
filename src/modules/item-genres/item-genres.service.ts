import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { LoggerService } from '@/utils/logger/logger.service';
import { IItemGenresRepository } from '@/repositories/interfaces/item-genres.repository.interface';
import { IItemsRepository } from '@/repositories/interfaces/items.repository.interface';
import { IGenresRepository } from '@/repositories/interfaces/genres.repository.interface';
import { CreateItemGenreDto } from './dto/create-item-genre.dto';

@Injectable()
export class ItemGenresService {
  private logger;

  constructor(
    @Inject('IItemGenresRepository')
    private readonly itemGenresRepository: IItemGenresRepository,
    @Inject('IItemsRepository')
    private readonly itemsRepository: IItemsRepository,
    @Inject('IGenresRepository')
    private readonly genresRepository: IGenresRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.logger = this.loggerService.createEntityLogger('ItemGenresService');
  }

  async create(createItemGenreDto: CreateItemGenreDto) {
    this.logger.info('Creating new item-genre relationship');


    const item = await this.itemsRepository.findById(createItemGenreDto.itemId);
    if (!item) {
      this.logger.warn(`Item with ID ${createItemGenreDto.itemId} not found`);
      throw new NotFoundException(`Item with ID ${createItemGenreDto.itemId} not found`);
    }

    const genre = await this.genresRepository.findById(createItemGenreDto.genreId);
    if (!genre) {
      this.logger.warn(`Genre with ID ${createItemGenreDto.genreId} not found`);
      throw new NotFoundException(`Genre with ID ${createItemGenreDto.genreId} not found`);
    }

    const existingRelation = await this.itemGenresRepository.findByItemAndGenre(
      createItemGenreDto.itemId,
      createItemGenreDto.genreId
    );
    if (existingRelation) {
      this.logger.warn(`Item-Genre relationship already exists`);
      throw new ConflictException(`Item is already associated with this genre`);
    }

    const data = await this.itemGenresRepository.create(createItemGenreDto);

    this.logger.info(`Item-Genre relationship created with ID: ${data.id}`);
    return { data };
  }

  async findAll({ limit = 10, page = 1, itemId, genreId }: { limit?: number, page?: number, itemId?: string, genreId?: string } = {}) {
    this.logger.info('Fetching item-genre relationships');

    if (itemId) {
      const data = await this.itemGenresRepository.findByItemId(itemId);
      this.logger.info(`Found ${data.length} genres for item ${itemId}`);
      return { data };
    }

    if (genreId) {
      const data = await this.itemGenresRepository.findByGenreId(genreId);
      this.logger.info(`Found ${data.length} items for genre ${genreId}`);
      return { data };
    }

    const data = await this.itemGenresRepository.findAll({ limit, page });
    this.logger.info(`Found ${data.totalItems} item-genre relationships`);

    return {
      ...data
    };
  }

  async findOne(id: string) {
    this.logger.info(`Fetching item-genre relationship with ID: ${id}`);

    const data = await this.itemGenresRepository.findById(id);

    if (!data) {
      this.logger.warn(`Item-Genre relationship with ID ${id} not found`);
      throw new NotFoundException(`Item-Genre relationship with ID ${id} not found`);
    }

    this.logger.info(`Item-Genre relationship found: ${data.id}`);
    return { data };
  }

  async findByItem(itemId: string) {
    this.logger.info(`Fetching genres for item with ID: ${itemId}`);

    const item = await this.itemsRepository.findById(itemId);
    if (!item) {
      this.logger.warn(`Item with ID ${itemId} not found`);
      throw new NotFoundException(`Item with ID ${itemId} not found`);
    }

    const data = await this.itemGenresRepository.findByItemId(itemId);

    this.logger.info(`Found ${data.length} genres for item ${itemId}`);
    return { data };
  }

  async remove(id: string) {
    this.logger.info(`Deleting item-genre relationship with ID: ${id}`);

    const data = await this.itemGenresRepository.delete(id);

    if (!data) {
      this.logger.warn(`Item-Genre relationship with ID ${id} not found for deletion`);
      return { data: null };
    }

    this.logger.info(`Item-Genre relationship deleted: ${data.id}`);
    return { data };
  }

  async removeByItemAndGenre(itemId: string, genreId: string) {
    this.logger.info(`Deleting item-genre relationship for item ${itemId} and genre ${genreId}`);

    const data = await this.itemGenresRepository.deleteByItemAndGenre(itemId, genreId);

    if (!data) {
      this.logger.warn(`Item-Genre relationship not found for deletion`);
      return { data: null };
    }

    this.logger.info(`Item-Genre relationship deleted: ${data.id}`);
    return { data };
  }
}
