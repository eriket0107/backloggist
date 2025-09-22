import { UserItem, NewUserItem, UserItemStatus } from "../../types/index.js";
import { UserItemsRepository } from "../userItems.repository.js";
import { randomUUID } from 'node:crypto';

export class UserItemsInMemoryRepository implements UserItemsRepository {
  private userItems: UserItem[] = [];

  async create(data: Omit<NewUserItem, 'addedAt'>): Promise<UserItem> {
    const userItem: UserItem = {
      id: randomUUID(),
      userId: data.userId,
      itemId: data.itemId,
      order: data.order || null,
      status: data.status || null,
      rating: data.rating || null,
      addedAt: new Date(),
    };

    this.userItems.push(userItem);
    return userItem;
  }

  async findById(id: string): Promise<UserItem | null> {
    const userItem = this.userItems.find(ui => ui.id === id);
    return userItem || null;
  }

  async update(id: string, data: Partial<Omit<NewUserItem, 'id' | 'userId' | 'itemId'>>): Promise<UserItem | undefined> {
    const userItemIndex = this.userItems.findIndex(ui => ui.id === id);
    if (userItemIndex === -1) {
      return undefined;
    }

    const updatedUserItem = {
      ...this.userItems[userItemIndex],
      ...data,
    };

    this.userItems[userItemIndex] = updatedUserItem;
    return updatedUserItem;
  }

  async delete(id: string): Promise<void> {
    const userItemIndex = this.userItems.findIndex(ui => ui.id === id);
    if (userItemIndex === -1) {
      return undefined;
    }

    this.userItems.splice(userItemIndex, 1);
  }

  async addItemToUserBacklog(userId: string, itemId: string, order?: number): Promise<UserItem | undefined> {
    const existingUserItem = await this.findUserItem(userId, itemId);
    if (existingUserItem) {
      return undefined;
    }

    const newUserItemData: Omit<NewUserItem, 'addedAt'> = {
      id: randomUUID(),
      userId,
      itemId,
      order: order || 0,
      status: UserItemStatus.PENDING,
      rating: null,
    };

    const userItem = await this.create(newUserItemData);

    return userItem;
  }

  async removeItemFromUserBacklog(userId: string, itemId: string): Promise<void> {
    const userItem = await this.findUserItem(userId, itemId);
    if (!userItem) {
      return undefined;
    }

    await this.delete(userItem.id);
  }

  async getUserBacklog(userId: string): Promise<UserItem[]> {
    return this.userItems
      .filter(ui => ui.userId === userId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getUserBacklogByStatus(userId: string, status: UserItemStatus): Promise<UserItem[]> {
    return this.userItems
      .filter(ui => ui.userId === userId && ui.status === status)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async updateUserItemStatus(userId: string, itemId: string, status: UserItemStatus): Promise<UserItem | undefined> {
    const userItem = await this.findUserItem(userId, itemId);
    if (!userItem) {
      return undefined;
    }

    return await this.update(userItem.id, { status });
  }

  async updateUserItemRating(userId: string, itemId: string, rating: number): Promise<UserItem | undefined> {
    const userItem = await this.findUserItem(userId, itemId);
    if (!userItem) {
      return undefined;
    }

    return await this.update(userItem.id, { rating: rating });
  }

  async updateUserItemOrder(userId: string, itemId: string, order: number): Promise<UserItem | undefined> {
    const userItem = await this.findUserItem(userId, itemId);
    if (!userItem) {
      return undefined;
    }

    return await this.update(userItem.id, { order });
  }

  async findUserItem(userId: string, itemId: string): Promise<UserItem | null> {
    const userItem = this.userItems.find(
      ui => ui.userId === userId && ui.itemId === itemId
    );
    return userItem || null;
  }

  async getUserCompletedItems(userId: string): Promise<UserItem[]> {
    return await this.getUserBacklogByStatus(userId, UserItemStatus.COMPLETED);
  }

  async getUserInProgressItems(userId: string): Promise<UserItem[]> {
    return await this.getUserBacklogByStatus(userId, UserItemStatus.IN_PROGRESS);
  }

  async getUserPendingItems(userId: string): Promise<UserItem[]> {
    return await this.getUserBacklogByStatus(userId, UserItemStatus.PENDING);
  }

  async getUserBacklogStats(userId: string): Promise<{
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
  }> {
    const userBacklog = await this.getUserBacklog(userId);

    const completed = userBacklog.filter(ui => ui.status === UserItemStatus.COMPLETED).length;
    const inProgress = userBacklog.filter(ui => ui.status === UserItemStatus.IN_PROGRESS).length;
    const pending = userBacklog.filter(ui => ui.status === UserItemStatus.PENDING).length;

    return {
      total: userBacklog.length,
      completed,
      inProgress,
      pending,
    };
  }
}
