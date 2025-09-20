import { UserItem, Logger } from '@/types/index.js';
import { UserItemsRepository } from '@/repositories/userItems.repository.js';

export interface UpdateUserItemRatingRequest {
  userId: string;
  itemId: string;
  rating: number;
}

export interface UpdateUserItemRatingResponse {
  userItem: UserItem;
}

export class UpdateUserItemRatingUseCase {
  constructor(
    private userItemsRepository: UserItemsRepository,
    private logger: Logger
  ) { }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(request: UpdateUserItemRatingRequest): Promise<UpdateUserItemRatingResponse> {
    // TODO: Add business logic here
    // - Validate user exists
    // - Validate item in backlog
    // - Validate rating range (1-10?)
    // - Update rating

    throw new Error('Not implemented');
  }
}