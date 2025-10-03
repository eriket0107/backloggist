import { Injectable } from '@nestjs/common';
import { IUserItemsRepository, CreateUserItemData, UpdateUserItemData } from '@/repositories/interfaces/user-items.repository.interface';
import { UserItem, UserItemWithDetails, BacklogStats } from '@/types/entities';

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

  async findByUserId(userId: string): Promise<UserItemWithDetails[]> {
    // In a real implementation, this would join with items
    // For now, we'll return user items without item details
    const userItems = this.userItems.filter(ui => ui.userId === userId);

    // Mock item details for demonstration
    return userItems.map(ui => ({
      ...ui,
      item: {
        id: ui.itemId,
        title: `Item ${ui.itemId}`,
        type: 'game' as const,
        note: 'Mock item',
        imgUrl: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }));
  }

  async findByUserAndItem(userId: string, itemId: string): Promise<UserItem | null> {
    return this.userItems.find(ui => ui.userId === userId && ui.itemId === itemId) || null;
  }

  async updateByUserAndItem(userId: string, itemId: string, userItemData: UpdateUserItemData): Promise<UserItem | null> {
    const userItemIndex = this.userItems.findIndex(ui => ui.userId === userId && ui.itemId === itemId);
    if (userItemIndex === -1) {
      return null;
    }

    this.userItems[userItemIndex] = {
      ...this.userItems[userItemIndex],
      ...userItemData,
    };

    return this.userItems[userItemIndex];
  }

  async deleteByUserAndItem(userId: string, itemId: string): Promise<UserItem | null> {
    const userItemIndex = this.userItems.findIndex(ui => ui.userId === userId && ui.itemId === itemId);
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
      inProgress: userItems.filter(ui => ui.status === 'in_progress').length,
      pending: userItems.filter(ui => ui.status === 'pending').length,
    };
  }
}
