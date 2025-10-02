import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { LoggerService } from '@/utils/logger/logger.service';
import { IItemsRepository } from '@/repositories/interfaces/items.repository.interface';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  private logger;

  constructor(
    @Inject('IItemsRepository')
    private readonly itemsRepository: IItemsRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.logger = this.loggerService.createEntityLogger('ItemsService');
  }

  async create(createItemDto: CreateItemDto) {
    this.logger.info('Creating new item');

    const data = await this.itemsRepository.create(createItemDto);

    this.logger.info(`Item created with ID: ${data.id}`);
    return { data };
  }

  async findAll({ limit = 10, page = 1 }: { limit?: number, page?: number } = {}) {
    this.logger.info('Fetching all items');
    const data = await this.itemsRepository.findAll({ limit, page });

    this.logger.info(`Found ${data.totalItems} items`);

    return {
      ...data
    };
  }

  async findOne(id: string) {
    this.logger.info(`Fetching item with ID: ${id}`);

    const data = await this.itemsRepository.findById(id);

    if (!data) {
      this.logger.warn(`Item with ID ${id} not found`);
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    this.logger.info(`Item found: ${data.title}`);
    return { data };
  }

  async update(id: string, updateItemDto: UpdateItemDto) {
    this.logger.info(`Updating item with ID: ${id}`);

    const data = await this.itemsRepository.update(id, {
      ...updateItemDto,
      updatedAt: new Date()
    });

    if (!data) {
      this.logger.warn(`Item with ID ${id} not found for update`);
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    this.logger.info(`Item updated: ${data.title}`);
    return { data };
  }

  async remove(id: string) {
    this.logger.info(`Deleting item with ID: ${id}`);

    const data = await this.itemsRepository.delete(id);

    if (!data) {
      this.logger.warn(`Item with ID ${id} not found for deletion`);
      return { data: null };
    }

    this.logger.info(`Item deleted: ${data.title}`);
    return { data };
  }
}