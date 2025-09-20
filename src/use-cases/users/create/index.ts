import { User } from '@/types/index.js';
import { UsersRepository } from '@/repositories/users.repository.js';

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
}

export interface CreateUserResponse {
  user: User;
}

export class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) { }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    // TODO: Add business logic here
    // - Validate email format
    // - Check if user already exists
    // - Hash password
    // - Create user

    throw new Error('Not implemented');
  }
}