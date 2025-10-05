import { UserItem, UserItemWithDetails, BacklogStats, Item } from '@/types/entities';
import { PaginatedResult } from '@/types/pagination';

export interface CreateUserItemData {
  userId: string;
  itemId: string;
  status?: 'completed' | 'in_progress' | 'pending';
  addedAt: Date;
}

export interface UpdateUserItemData {
  order?: number;
  status?: 'completed' | 'in_progress' | 'pending';
  rating?: number;
}

export interface IUserItemsRepository {
  create(userItemData: CreateUserItemData): Promise<UserItem>;
  findByBacklogByUser({ userId, limit, type, page, search }: { limit?: number, page?: number, search: string, type: Item['type'], userId: string, }): Promise<PaginatedResult<UserItemWithDetails>>;
  findByUserAndItem({ userId, id, }: { userId: string, id: string }): Promise<UserItem | null>;
  updateByUserAndItem(userId: string, id: string, userItemData: UpdateUserItemData): Promise<UserItem | null>;
  deleteByUserAndItem(userId: string, id: string): Promise<UserItem | null>;
  getStatsByUserId(userId: string): Promise<BacklogStats>;
}
