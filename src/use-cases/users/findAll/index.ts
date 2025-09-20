import { User } from '@/types/index.js';
import { UsersRepository } from '@/repositories/users.repository.js';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FindAllUsersRequest {
  // Add pagination/filtering options if needed
}

export interface FindAllUsersResponse {
  users: User[];
}

export class FindAllUsersUseCase {
  constructor(private usersRepository: UsersRepository) { }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(request: FindAllUsersRequest): Promise<FindAllUsersResponse> {
    // TODO: Add business logic here
    // - Add pagination logic
    // - Add filtering/sorting

    throw new Error('Not implemented');
  }
}