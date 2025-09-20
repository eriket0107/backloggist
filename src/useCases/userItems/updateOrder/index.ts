import { UserItem } from '@/types/index.js';
import { UserItemsRepository } from '@/repositories/userItems.repository.js';

export interface UpdateUserItemOrderRequest {
  userId: string;
  itemId: string;
  order: number;
}

export interface UpdateUserItemOrderResponse {
  userItem: UserItem;
}

export class UpdateUserItemOrderUseCase {
  constructor(private userItemsRepository: UserItemsRepository) { }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(request: UpdateUserItemOrderRequest): Promise<UpdateUserItemOrderResponse> {
    // TODO: Add business logic here
    // - Validate user exists
    // - Validate item in backlog
    // - Update order/priority
    // - Handle order conflicts

    throw new Error('Not implemented');
  }
}