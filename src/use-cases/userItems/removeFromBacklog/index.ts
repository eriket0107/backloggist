import { UserItemsRepository } from '@/repositories/userItems.repository.js';

export interface RemoveItemFromBacklogRequest {
  userId: string;
  itemId: string;
}

export interface RemoveItemFromBacklogResponse {
  success: boolean;
}

export class RemoveItemFromBacklogUseCase {
  constructor(private userItemsRepository: UserItemsRepository) { }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_request: RemoveItemFromBacklogRequest): Promise<RemoveItemFromBacklogResponse> {
    // TODO: Add business logic here
    // - Validate user exists
    // - Validate item exists in backlog
    // - Remove item from backlog

    throw new Error('Not implemented');
  }
}