import { Logger } from '@/types/index.js';
import { UsersRepository } from '@/repositories/users.repository.js';

export interface DeleteUserRequest {
  id: string;
}

export interface DeleteUserResponse {
  success: boolean;
}

export class DeleteUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private logger: Logger
  ) { }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(request: DeleteUserRequest): Promise<DeleteUserResponse> {
    // TODO: Add business logic here
    // - Validate user exists
    // - Check if user has dependencies (userItems)
    // - Delete user

    throw new Error('Not implemented');
  }
}