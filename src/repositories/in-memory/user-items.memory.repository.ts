import { Injectable } from '@nestjs/common';
import { IUserItemsRepository, CreateUserItemData, UpdateUserItemData } from '@/repositories/interfaces/user-items.repository.interface';
import { UserItem, UserItemWithDetails, BacklogStats, Item } from '@/types/entities';
import { PaginatedResult } from '@/types/pagination';

@Injectable()
export class UserItemsMemoryRepository implements IUserItemsRepository {
  private userItems: UserItem[] = [];
  private nextId = 1;

  async create(userItemData: CreateUserItemData): Promise<UserItem> {
    const userItem: UserItem = {
      id: this.nextId.toString(),
      userId: userItemData.userId,
      itemId: userItemData.itemId,
      status: userItemData.status || 'pending',
      addedAt: userItemData.addedAt,
    };

    this.userItems.push(userItem);
    this.nextId++;
    return userItem;
  }

  async findByBacklogByUser({ userId, limit = 10, page = 1, search, type }: { limit?: number, page?: number, userId: string, type?: Item['type'], search?: string }): Promise<PaginatedResult<UserItemWithDetails>> {
    let userItems = this.userItems.filter(ui => ui.userId === userId);

    if (search) {
      userItems = userItems.filter(ui =>
        `Mock Item ${ui.itemId}`.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (type) {
      userItems = userItems.filter(() => {

        return type === 'game';
      });
    }

    const totalItems = userItems.length;
    const totalPages = Math.ceil(totalItems / limit);
    const offset = (page - 1) * limit;
    const paginatedItems = userItems.slice(offset, offset + limit);

    const data = paginatedItems.map(ui => ({
      ...ui,
      item: {
        id: ui.itemId,
        title: `Mock Item ${ui.itemId}`,
        type: 'game' as const,
        note: 'Mock item for testing',
        imgUrl: `https://example.com/image-${ui.itemId}.jpg`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }));

    return {
      data,
      totalItems,
      totalPages,
      currentPage: page,
      isFirstPage: page === 1,
      isLastPage: page === totalPages,
    };
  }

  async findByUserAndItem({ id, userId }: { userId: string, id: string }): Promise<UserItem | null> {
    return this.userItems.find(ui => ui.userId === userId && ui.id === id) || null;
  }

  async updateByUserAndItem(userId: string, id: string, userItemData: UpdateUserItemData): Promise<UserItem | null> {
    const userItemIndex = this.userItems.findIndex(ui => ui.userId === userId && ui.id === id);
    if (userItemIndex === -1) {
      return null;
    }

    this.userItems[userItemIndex] = {
      ...this.userItems[userItemIndex],
      ...userItemData,
    };

    return this.userItems[userItemIndex];
  }

  async deleteByUserAndItem(userId: string, id: string): Promise<UserItem | null> {
    const userItemIndex = this.userItems.findIndex(ui => ui.userId === userId && ui.id === id);
    if (userItemIndex === -1) {
      return null;
    }

    const deletedUserItem = this.userItems[userItemIndex];
    this.userItems.splice(userItemIndex, 1);
    return deletedUserItem;
  }

  async getStatsByUserId(userId: string): Promise<BacklogStats> {
    const userItems = this.userItems.filter(ui => ui.userId === userId);

    return {
      total: userItems.length,
      completed: userItems.filter(ui => ui.status === 'completed').length,
      in_progress: userItems.filter(ui => ui.status === 'in_progress').length,
      pending: userItems.filter(ui => ui.status === 'pending').length,
    };
  }
}
