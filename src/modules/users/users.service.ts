import { Injectable, Inject } from '@nestjs/common';
import { LoggerService } from '@/modules/logger/logger.service';
import { IUsersRepository } from '@/repositories/interfaces/users.repository.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private logger;

  constructor(
    @Inject('IUsersRepository')
    private readonly usersRepository: IUsersRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.logger = this.loggerService.createEntityLogger('UsersService');
  }

  async create(createUserDto: CreateUserDto) {
    this.logger.info('Creating new user');

    const user = await this.usersRepository.create(createUserDto);

    this.logger.info(`User created with ID: ${user.id}`);
    return user;
  }

  async findAll() {
    this.logger.info('Fetching all users');

    const users = await this.usersRepository.findAll();

    this.logger.info(`Found ${users.length} users`);
    return users;
  }

  async findOne(id: string) {
    this.logger.info(`Fetching user with ID: ${id}`);

    const user = await this.usersRepository.findById(id);

    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      return null;
    }

    this.logger.info(`User found: ${user.email}`);
    return user;
  }

  async findByEmail(email: string) {
    this.logger.info(`Fetching user with email: ${email}`);

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      this.logger.warn(`User with email ${email} not found`);
      return null;
    }

    this.logger.info(`User found: ${user.email}`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    this.logger.info(`Updating user with ID: ${id}`);

    const user = await this.usersRepository.update(id, {
      ...updateUserDto,
      updatedAt: new Date()
    });

    if (!user) {
      this.logger.warn(`User with ID ${id} not found for update`);
      return null;
    }

    this.logger.info(`User updated: ${user.email}`);
    return user;
  }

  async remove(id: string) {
    this.logger.info(`Deleting user with ID: ${id}`);

    const user = await this.usersRepository.delete(id);

    if (!user) {
      this.logger.warn(`User with ID ${id} not found for deletion`);
      return null;
    }

    this.logger.info(`User deleted: ${user.email}`);
    return user;
  }
}