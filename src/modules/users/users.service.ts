import { Injectable, Inject, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { LoggerService } from '@/utils/logger/logger.service';
import { IUsersRepository } from '@/repositories/interfaces/users.repository.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordHandler } from '@/utils/password-handler/password-handler.service';

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

    const existingEmailResult = await this.findByEmail(createUserDto.email);

    if (existingEmailResult.data) {
      this.logger.warn(`Email: ${existingEmailResult.data.email} already exists.`);
      throw new ConflictException('This email address is already in use.');
    }

    if (createUserDto.password.length < 8) {
      this.logger.warn(`The password ${createUserDto.password.length} must equal or greater than 8.`);
      throw new BadRequestException('Password must be equal to or greater than 8 characters.')
    }

    const passwordHash = await this.passwordHandler.hashPassword(createUserDto.password)

    const data = await this.usersRepository.create({
      ...createUserDto,
      password: passwordHash,
    });

    this.logger.info(`User created with ID: ${data.id}`);

    const userResponse = { ...data };
    delete userResponse.password;

    return { data: userResponse };
  }

  async findAll() {
    this.logger.info('Fetching all users');

    const data = await this.usersRepository.findAll();

    this.logger.info(`Found ${data.length} users`);
    return { data };
  }

  async findOne(id: string) {
    this.logger.info(`Fetching user with ID: ${id}`);

    const data = await this.usersRepository.findById(id);

    if (!data) {
      this.logger.warn(`User with ID ${id} not found`);
      return { data: null };
    }

    this.logger.info(`User found: ${data.email}`);
    return { data };
  }

  async findByEmail(email: string) {
    this.logger.info(`Fetching user with email: ${email}`);

    const data = await this.usersRepository.findByEmail(email);

    if (!data) {
      this.logger.warn(`User with email ${email} not found`);
      return { data: null };
    }

    this.logger.info(`User found: ${data.email}`);
    return { data };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    this.logger.info(`Updating user with ID: ${id}`);
    this.logger.info(`Updating user with DTO: ${JSON.stringify(updateUserDto)}`);

    const existingUserResult = await this.findOne(id);
    if (!existingUserResult.data) {
      this.logger.warn(`User with ID ${id} not found for update`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const existingUser = existingUserResult.data;
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
      updatedAt: new Date()
    };

    if (newPassword) {
      data.password = newPassword;
    }

    const updatedUser = await this.usersRepository.update(id, data);

    if (!updatedUser) {
      return { data: null };
    }

    const userResponse = { ...updatedUser };
    delete userResponse.password;

    this.logger.info(`User updated: ${updatedUser.email}`);
    return { data: userResponse };
  }

  async remove(id: string) {
    this.logger.info(`Deleting user with ID: ${id}`);

    const data = await this.usersRepository.delete(id);

    if (!data) {
      this.logger.warn(`User with ID ${id} not found for deletion`);
      return { data: null };
    }

    this.logger.info(`User deleted: ${data.email}`);
    return { data };
  }
}