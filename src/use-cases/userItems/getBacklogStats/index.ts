import { UserItemsRepository } from '@/repositories/userItems.repository.js';

export interface GetUserBacklogStatsRequest {
  userId: string;
}

export interface GetUserBacklogStatsResponse {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
  };
}

export class GetUserBacklogStatsUseCase {
  constructor(private userItemsRepository: UserItemsRepository) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_request: GetUserBacklogStatsRequest): Promise<GetUserBacklogStatsResponse> {
    // TODO: Add business logic here
    // - Validate user exists
    // - Get backlog statistics
    // - Calculate completion percentages
    
    throw new Error('Not implemented');
  }
}