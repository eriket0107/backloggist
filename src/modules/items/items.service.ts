import { Injectable, Inject } from '@nestjs/common';
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

    const item = await this.itemsRepository.create(createItemDto);

    this.logger.info(`Item created with ID: ${item.id}`);
    return item;
  }

  async findAll() {
    this.logger.info('Fetching all items');

    const items = await this.itemsRepository.findAll();

    this.logger.info(`Found ${items.length} items`);
    return items;
  }

  async findOne(id: string) {
    this.logger.info(`Fetching item with ID: ${id}`);

    const item = await this.itemsRepository.findById(id);

    if (!item) {
      this.logger.warn(`Item with ID ${id} not found`);
      return null;
    }

    this.logger.info(`Item found: ${item.title}`);
    return item;
  }

  async update(id: string, updateItemDto: UpdateItemDto) {
    this.logger.info(`Updating item with ID: ${id}`);

    const item = await this.itemsRepository.update(id, updateItemDto);

    if (!item) {
      this.logger.warn(`Item with ID ${id} not found for update`);
      return null;
    }

    this.logger.info(`Item updated: ${item.title}`);
    return item;
  }

  async remove(id: string) {
    this.logger.info(`Deleting item with ID: ${id}`);

    const item = await this.itemsRepository.delete(id);

    if (!item) {
      this.logger.warn(`Item with ID ${id} not found for deletion`);
      return null;
    }

    this.logger.info(`Item deleted: ${item.title}`);
    return item;
  }
}