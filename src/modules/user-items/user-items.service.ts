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

    const data = await this.userItemsRepository.create({
      userId,
      itemId: addToBacklogDto.itemId,
      status: addToBacklogDto.status || 'pending' as 'completed' | 'in_progress' | 'pending',
      addedAt: new Date(),
    });

    this.logger.info(`Item added to backlog with ID: ${data.id}`);
    return { data };
  }

  async getUserBacklog(userId: string) {
    this.logger.info(`Fetching backlog for user ${userId}`);

    const data = await this.userItemsRepository.findByUserId(userId);

    this.logger.info(`Found ${data.length} items in user backlog`);
    return { data };
  }

  async updateUserItem(userId: string, itemId: string, updateUserItemDto: UpdateUserItemDto) {
    this.logger.info(`Updating user item for user ${userId}, item ${itemId}`);

    const data = await this.userItemsRepository.updateByUserAndItem(
      userId,
      itemId,
      updateUserItemDto
    );

    if (!data) {
      this.logger.warn(`User item not found for user ${userId}, item ${itemId}`);
      return { data: null };
    }

    this.logger.info(`User item updated: ${data.id}`);
    return { data };
  }

  async removeFromBacklog(userId: string, itemId: string) {
    this.logger.info(`Removing item ${itemId} from user ${userId} backlog`);

    const data = await this.userItemsRepository.deleteByUserAndItem(userId, itemId);

    if (!data) {
      this.logger.warn(`User item not found for deletion: user ${userId}, item ${itemId}`);
      return { data: null };
    }

    this.logger.info(`Item removed from backlog: ${data.id}`);
    return { data };
  }

  async getBacklogStats(userId: string) {
    this.logger.info(`Fetching backlog stats for user ${userId}`);

    const data = await this.userItemsRepository.getStatsByUserId(userId);

    this.logger.info(`Backlog stats: ${JSON.stringify(data)}`);
    return { data };
  }
}