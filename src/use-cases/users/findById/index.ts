import { User } from '@/types/index.js';
import { UsersRepository } from '@/repositories/users.repository.js';

export interface FindUserByIdRequest {
  id: string;
}

export interface FindUserByIdResponse {
  user: User | null;
}

export class FindUserByIdUseCase {
  constructor(private usersRepository: UsersRepository) { }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(request: FindUserByIdRequest): Promise<FindUserByIdResponse> {
    // TODO: Add business logic here
    // - Validate ID format
    // - Find user

    throw new Error('Not implemented');
  }
}