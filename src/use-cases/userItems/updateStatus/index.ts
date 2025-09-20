import { UserItem, UserItemStatus } from '@/types/index.js';
import { UserItemsRepository } from '@/repositories/userItems.repository.js';

export interface UpdateUserItemStatusRequest {
  userId: string;
  itemId: string;
  status: UserItemStatus;
}

export interface UpdateUserItemStatusResponse {
  userItem: UserItem;
}

export class UpdateUserItemStatusUseCase {
  constructor(private userItemsRepository: UserItemsRepository) { }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(request: UpdateUserItemStatusRequest): Promise<UpdateUserItemStatusResponse> {
    // TODO: Add business logic here
    // - Validate user exists
    // - Validate item in backlog
    // - Validate status transition
    // - Update status

    throw new Error('Not implemented');
  }
}