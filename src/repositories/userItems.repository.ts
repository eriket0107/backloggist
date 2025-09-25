import { UserItem, NewUserItem, UserItemStatus } from "../types/index.js";

export interface UserItemsRepository {
  create(data: Omit<NewUserItem, 'addedAt'>): Promise<UserItem>;
  findById(id: string): Promise<UserItem | null>;
  update(id: string, data: Partial<Omit<NewUserItem, 'id' | 'userId' | 'itemId'>>): Promise<UserItem | undefined>;
  delete(id: string): Promise<void>;

  addItemToUserBacklog(userId: string, itemId: string, order?: number): Promise<UserItem | undefined>;
  removeItemFromUserBacklog(userId: string, itemId: string): Promise<void>;
  getUserBacklog(userId: string): Promise<UserItem[]>;
  getUserBacklogByStatus(userId: string, status: UserItemStatus): Promise<UserItem[]>;

  updateUserItemStatus(userId: string, itemId: string, status: UserItemStatus): Promise<UserItem | undefined>;
  updateUserItemRating(userId: string, itemId: string, rating: number): Promise<UserItem | undefined>;
  updateUserItemOrder(userId: string, itemId: string, order: number): Promise<UserItem | undefined>;

  findUserItem(userId: string, itemId: string): Promise<UserItem | null>;


  getUserBacklogStats(userId: string): Promise<{
    status: "completed" | "in_progress" | "pending" | null;
    count: number;
  }[]>;
}
