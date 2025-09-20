import { UserItem, UserItemStatus } from '@/types/index.js';
import { UserItemsRepository } from '@/repositories/userItems.repository.js';

export interface GetUserBacklogRequest {
  userId: string;
  status?: UserItemStatus;
}

export interface GetUserBacklogResponse {
  items: UserItem[];
}

export class GetUserBacklogUseCase {
  constructor(private userItemsRepository: UserItemsRepository) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(request: GetUserBacklogRequest): Promise<GetUserBacklogResponse> {
    // TODO: Add business logic here
    // - Validate user exists
    // - Get backlog items by status or all
    // - Apply sorting/ordering
    
    throw new Error('Not implemented');
  }
}