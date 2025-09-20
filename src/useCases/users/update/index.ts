import { User } from '@/types/index.js';
import { UsersRepository } from '@/repositories/users.repository.js';

export interface UpdateUserRequest {
  id: string;
  email?: string;
  password?: string;
  name?: string;
}

export interface UpdateUserResponse {
  user: User;
}

export class UpdateUserUseCase {
  constructor(private usersRepository: UsersRepository) { }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    // TODO: Add business logic here
    // - Validate user exists
    // - Validate new email if provided
    // - Hash new password if provided
    // - Update user

    throw new Error('Not implemented');
  }
}