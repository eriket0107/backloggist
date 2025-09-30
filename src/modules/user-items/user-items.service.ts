import { Injectable, Inject } from '@nestjs/common';
import { LoggerService } from '@/utils/logger/logger.service';
import { IUserItemsRepository } from '@/repositories/interfaces/user-items.repository.interface';
import { AddToBacklogDto } from './dto/add-to-backlog.dto';
import { UpdateUserItemDto } from './dto/update-user-item.dto';

@Injectable()
export class UserItemsService {
  private logger;

  constructor(
    @Inject('IUserItemsRepository')
    private readonly userItemsRepository: IUserItemsRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.logger = this.loggerService.createEntityLogger('UserItemsService');
  }

  async addToBacklog(userId: string, addToBacklogDto: AddToBacklogDto) {
    this.logger.info(`Adding item ${addToBacklogDto.itemId} to user ${userId} backlog`);

    const userItem = await this.userItemsRepository.create({
      userId,
      itemId: addToBacklogDto.itemId,
      status: addToBacklogDto.status || 'pending' as 'completed' | 'in_progress' | 'pending',
      addedAt: new Date(),
    });

    this.logger.info(`Item added to backlog with ID: ${userItem.id}`);
    return userItem;
  }

  async getUserBacklog(userId: string) {
    this.logger.info(`Fetching backlog for user ${userId}`);

    const userItems = await this.userItemsRepository.findByUserId(userId);

    this.logger.info(`Found ${userItems.length} items in user backlog`);
    return userItems;
  }

  async updateUserItem(userId: string, itemId: string, updateUserItemDto: UpdateUserItemDto) {
    this.logger.info(`Updating user item for user ${userId}, item ${itemId}`);

    const userItem = await this.userItemsRepository.updateByUserAndItem(
      userId,
      itemId,
      updateUserItemDto
    );

    if (!userItem) {
      this.logger.warn(`User item not found for user ${userId}, item ${itemId}`);
      return null;
    }

    this.logger.info(`User item updated: ${userItem.id}`);
    return userItem;
  }

  async removeFromBacklog(userId: string, itemId: string) {
    this.logger.info(`Removing item ${itemId} from user ${userId} backlog`);

    const userItem = await this.userItemsRepository.deleteByUserAndItem(userId, itemId);

    if (!userItem) {
      this.logger.warn(`User item not found for deletion: user ${userId}, item ${itemId}`);
      return null;
    }

    this.logger.info(`Item removed from backlog: ${userItem.id}`);
    return userItem;
  }

  async getBacklogStats(userId: string) {
    this.logger.info(`Fetching backlog stats for user ${userId}`);

    const stats = await this.userItemsRepository.getStatsByUserId(userId);

    this.logger.info(`Backlog stats: ${JSON.stringify(stats)}`);
    return stats;
  }
}