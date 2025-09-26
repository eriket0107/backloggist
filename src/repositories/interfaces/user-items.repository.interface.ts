import { UserItem, UserItemWithDetails, BacklogStats } from '@/types/entities';

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
  findByUserId(userId: string): Promise<UserItemWithDetails[]>;
  findByUserAndItem(userId: string, itemId: string): Promise<UserItem | null>;
  updateByUserAndItem(userId: string, itemId: string, userItemData: UpdateUserItemData): Promise<UserItem | null>;
  deleteByUserAndItem(userId: string, itemId: string): Promise<UserItem | null>;
  getStatsByUserId(userId: string): Promise<BacklogStats>;
}
