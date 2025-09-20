import { User } from '@/types/index.js';
import { UsersRepository } from '@/repositories/users.repository.js';

export interface FindUserByEmailRequest {
  email: string;
}

export interface FindUserByEmailResponse {
  user: User | null;
}

export class FindUserByEmailUseCase {
  constructor(private usersRepository: UsersRepository) { }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(request: FindUserByEmailRequest): Promise<FindUserByEmailResponse> {
    // TODO: Add business logic here
    // - Validate email format
    // - Find user

    throw new Error('Not implemented');
  }
}