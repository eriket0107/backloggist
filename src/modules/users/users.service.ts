import { Injectable, Inject, ConflictException, BadRequestException } from '@nestjs/common';
import { LoggerService } from '@/modules/logger/logger.service';
import { IUsersRepository } from '@/repositories/interfaces/users.repository.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordHandler } from '@/ultils/password-handler.module';

@Injectable()
export class UsersService {
  private logger;

  constructor(
    @Inject('IUsersRepository')
    private readonly usersRepository: IUsersRepository,
    private readonly loggerService: LoggerService,
    private readonly passwordHandler: PasswordHandler,
  ) {
    this.logger = this.loggerService.createEntityLogger('UsersService');
  }

  async create(createUserDto: CreateUserDto) {
    this.logger.info('Creating new user');

    const existingEmail = await this.findByEmail(createUserDto.email)

    if (existingEmail) {
      this.logger.warn(`Email: ${existingEmail} already exists.`);
      throw new ConflictException('This email address is already in use.');
    }

    if (createUserDto.password.length < 8) {
      this.logger.warn(`The password ${createUserDto.password.length} must equal or greater than 8.`);
      throw new BadRequestException('Password must be equal to or greater than 8 characters.')
    }

    const passwordHash = await this.passwordHandler.hashPassword(createUserDto.password)

    const user = await this.usersRepository.create({
      ...createUserDto,
      password: passwordHash,
    });

    this.logger.info(`User created with ID: ${user.id}`);

    delete user.password

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
    this.logger.info(`Updating user with DTO: ${JSON.stringify(updateUserDto)}`);

    const existingUser = await this.findOne(id);
    if (!existingUser) {
      this.logger.warn(`User with ID ${id} not found for update`);
      return null;
    }

    let newPassword: string | undefined;

    if (updateUserDto.newPassword) {
      if (!updateUserDto.password) {
        this.logger.warn('Current password is required to change password');
        throw new BadRequestException('Current password is required to change password');
      }

      if (updateUserDto.newPassword.length < 8) {
        this.logger.warn(`New password length ${updateUserDto.newPassword.length} must be equal or greater than 8`);
        throw new BadRequestException('New password must be equal to or greater than 8 characters');
      }

      const isValidPassword = await this.passwordHandler.comparePassword(
        updateUserDto.password,
        existingUser.password
      );

      if (!isValidPassword) {
        this.logger.warn("Current password doesn't match");
        throw new BadRequestException("Current password doesn't match");
      }

      const isSamePassword = await this.passwordHandler.comparePassword(
        updateUserDto.newPassword,
        existingUser.password
      );

      if (isSamePassword) {
        this.logger.warn('New password must be different from current password');
        throw new BadRequestException('New password must be different from current password');
      }

      newPassword = await this.passwordHandler.hashPassword(updateUserDto.newPassword);
    }

    const data = {
      ...updateUserDto,
      password: newPassword || undefined,
      updatedAt: new Date()
    };

    const user = await this.usersRepository.update(id, data);

    delete user.password

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