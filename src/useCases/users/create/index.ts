import { NewUser, User } from '@/types/index.js';
import { UsersRepository } from '@/repositories/users.repository.js';
import { Logger } from '@/utils/logger';
import { randomUUID } from 'node:crypto';

export interface CreateUserRequest {
  user: NewUser
}

export interface CreateUserResponse {
  user: User;
}

export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private logger: Logger,
  ) { }
  async execute({ user }: CreateUserRequest): Promise<CreateUserResponse> {
    const loggerInstance = this.logger.createEntityLogger('user')
    try {

      const duplicatedEmail = await this.usersRepository.findByEmail(user.email)

      if (duplicatedEmail) {
        loggerInstance.error(`Email already exitis. ${JSON.stringify(duplicatedEmail.email)}`)
        throw new Error('Email Already Exists.')
      }

      loggerInstance.info(`Starting user creation process: ${JSON.stringify({
        email: user.email,
        name: user.name
      })} `)

      const createdUser = await this.usersRepository.create({
        id: randomUUID(),
        ...user
      })

      loggerInstance.info(`User created successfully ${JSON.stringify({
        email: user.email,
        name: user.name
      })}`)

      return {
        user: createdUser,
      }
    } catch (error) {
      loggerInstance.error(`Failed to create user: ${JSON.stringify({
        email: user.email,
        error: error instanceof Error ? error.message : 'Unknown error'
      })}`)
      throw error
    }
  }
}