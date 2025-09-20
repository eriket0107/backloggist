import { UserItem, Logger } from '@/types/index.js';
import { UserItemsRepository } from '@/repositories/userItems.repository.js';

export interface AddItemToBacklogRequest {
  userId: string;
  itemId: string;
  order?: number;
}

export interface AddItemToBacklogResponse {
  userItem: UserItem;
}

export class AddItemToBacklogUseCase {
  constructor(
    private userItemsRepository: UserItemsRepository,
    private logger: Logger
  ) { }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(request: AddItemToBacklogRequest): Promise<AddItemToBacklogResponse> {
    // TODO: Add business logic here
    // - Validate user exists
    // - Validate item exists
    // - Check if item already in backlog
    // - Add item to backlog

    throw new Error('Not implemented');
  }
}