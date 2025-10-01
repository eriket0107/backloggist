import { ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { LoggerService } from '@/utils/logger/logger.service';
import { UsersMemoryRepository } from '@/repositories/in-memory/users.memory.repository';
import { PasswordHandler } from '@/utils/password-handler/password-handler.service';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import { User } from '@/types/entities';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersMemoryRepository;
  let mockLoggerService: jest.Mocked<LoggerService>;
  let passwordHandler: PasswordHandler;
  let mockLogger: { info: jest.Mock; warn: jest.Mock; error: jest.Mock; };

  const mockCreateUserDto: CreateUserDto = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  };

  const mockUpdateUserDto: UpdateUserDto = {
    name: 'Jane Doe',
    email: 'jane@example.com',
  };

  beforeEach(() => {
    repository = new UsersMemoryRepository();

    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    mockLoggerService = {
      createEntityLogger: jest.fn().mockReturnValue(mockLogger),
    } as unknown as jest.Mocked<LoggerService>;

    passwordHandler = new PasswordHandler();

    service = new UsersService(repository, mockLoggerService, passwordHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
    (repository as unknown as { users: User[]; nextId: number }).users = [];
    (repository as unknown as { users: User[]; nextId: number }).nextId = 1;
  });

  describe('create', () => {
    it('should create a user successfully and store in repository', async () => {
      const result = await service.create(mockCreateUserDto);

      expect(result).toBeDefined();
      expect(result.id).toBe('1');
      expect(result.name).toBe(mockCreateUserDto.name);
      expect(result.email).toBe(mockCreateUserDto.email);
      expect(result.password).toBeUndefined();
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);

      const storedUser = await repository.findById('1');
      expect(storedUser).toBeDefined();
      expect(storedUser!.email).toBe(mockCreateUserDto.email);
      expect(storedUser!.password).not.toBe(mockCreateUserDto.password);
      expect(storedUser!.password).toBeTruthy();
    });

    it('should throw ConflictException when email already exists in repository', async () => {
      await service.create(mockCreateUserDto);

      await expect(service.create(mockCreateUserDto)).rejects.toThrow(ConflictException);
      expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('already exists'));

      const allUsers = await repository.findAll();
      expect(allUsers).toHaveLength(1);
    });

    it('should throw BadRequestException when password is too short', async () => {
      const shortPasswordDto = { ...mockCreateUserDto, password: '1234567' };

      await expect(service.create(shortPasswordDto)).rejects.toThrow(BadRequestException);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        `The password ${shortPasswordDto.password.length} must equal or greater than 8.`
      );

      const allUsers = await repository.findAll();
      expect(allUsers).toHaveLength(0);
    });

    it('should create multiple users with sequential IDs', async () => {
      const user1Dto = { ...mockCreateUserDto, email: 'user1@example.com' };
      const user2Dto = { ...mockCreateUserDto, email: 'user2@example.com' };

      const result1 = await service.create(user1Dto);
      const result2 = await service.create(user2Dto);

      expect(result1.id).toBe('1');
      expect(result2.id).toBe('2');

      const allUsers = await repository.findAll();
      expect(allUsers).toHaveLength(2);
      expect(allUsers[0].email).toBe('user1@example.com');
      expect(allUsers[1].email).toBe('user2@example.com');
    });
  });

  describe('findAll', () => {
    it('should return empty array when no users exist', async () => {
      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockLogger.info).toHaveBeenCalledWith('Found 0 users');
    });

    it('should return all users from repository', async () => {
      await service.create({ ...mockCreateUserDto, email: 'user1@example.com' });
      await service.create({ ...mockCreateUserDto, email: 'user2@example.com' });

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].email).toBe('user1@example.com');
      expect(result[1].email).toBe('user2@example.com');
      expect(mockLogger.info).toHaveBeenCalledWith('Found 2 users');
    });
  });

  describe('findOne', () => {
    it('should return null when user does not exist', async () => {
      const result = await service.findOne('999');

      expect(result).toBeNull();
      expect(mockLogger.warn).toHaveBeenCalledWith('User with ID 999 not found');
    });

    it('should return user when found in repository', async () => {
      await service.create(mockCreateUserDto);

      const result = await service.findOne('1');

      expect(result).toBeDefined();
      expect(result!.id).toBe('1');
      expect(result!.email).toBe(mockCreateUserDto.email);
      expect(result!.password).toBeTruthy();
      expect(mockLogger.info).toHaveBeenCalledWith(`User found: ${mockCreateUserDto.email}`);
    });
  });

  describe('findByEmail', () => {
    it('should return null when user does not exist', async () => {
      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
      expect(mockLogger.warn).toHaveBeenCalledWith('User with email nonexistent@example.com not found');
    });

    it('should return user when found by email in repository', async () => {
      await service.create(mockCreateUserDto);

      const result = await service.findByEmail(mockCreateUserDto.email);

      expect(result).toBeDefined();
      expect(result!.email).toBe(mockCreateUserDto.email);
      expect(result!.password).toBeTruthy();
      expect(mockLogger.info).toHaveBeenCalledWith(`User found: ${mockCreateUserDto.email}`);
    });
  });

  describe('update', () => {
    let existingUser: User;
    let originalPassword: string;

    beforeEach(async () => {
      await service.create(mockCreateUserDto);

      existingUser = (await repository.findById('1'))!;
      originalPassword = existingUser.password;
    });

    it('should throw NotFoundException when user not found for update', async () => {
      await expect(service.update('999', mockUpdateUserDto)).rejects.toThrow(NotFoundException);
      expect(mockLogger.warn).toHaveBeenCalledWith('User with ID 999 not found for update');
    });

    it('should update user successfully without password change', async () => {
      const result = await service.update('1', mockUpdateUserDto);

      expect(result).toBeDefined();
      expect(result!.name).toBe(mockUpdateUserDto.name);
      expect(result!.email).toBe(mockUpdateUserDto.email);
      expect(result!.password).toBeUndefined();
      expect(result!.updatedAt.getTime()).toBeGreaterThanOrEqual(existingUser.updatedAt.getTime());

      const updatedUser = await repository.findById('1');
      expect(updatedUser!.name).toBe(mockUpdateUserDto.name);
      expect(updatedUser!.email).toBe(mockUpdateUserDto.email);
      expect(updatedUser!.password).toBe(originalPassword);
    });

    it('should update user with password change successfully', async () => {
      const updateDto: UpdateUserDto = {
        ...mockUpdateUserDto,
        password: 'password123',
        newPassword: 'newPassword123',
      };

      jest.spyOn(passwordHandler, 'comparePassword')
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);
      jest.spyOn(passwordHandler, 'hashPassword').mockResolvedValue('newHashedPassword123');

      const result = await service.update('1', updateDto);

      expect(result).toBeDefined();
      expect(result!.password).toBeUndefined();

      const updatedUser = await repository.findById('1');
      expect(updatedUser!.password).toBe('newHashedPassword123');
    });

    it('should throw BadRequestException when current password is required but not provided', async () => {
      const updateDto: UpdateUserDto = {
        newPassword: 'newPassword123',
      };

      await expect(service.update('1', updateDto)).rejects.toThrow(BadRequestException);
      expect(mockLogger.warn).toHaveBeenCalledWith('Current password is required to change password');

      const unchangedUser = await repository.findById('1');
      expect(unchangedUser).toEqual(existingUser);
    });

    it('should throw BadRequestException when new password is too short', async () => {
      const updateDto: UpdateUserDto = {
        password: 'oldPassword123',
        newPassword: '1234567',
      };

      await expect(service.update('1', updateDto)).rejects.toThrow(BadRequestException);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'New password length 7 must be equal or greater than 8'
      );

      const unchangedUser = await repository.findById('1');
      expect(unchangedUser).toEqual(existingUser);
    });

    it('should throw BadRequestException when current password is invalid', async () => {
      const updateDto: UpdateUserDto = {
        password: 'wrongPassword',
        newPassword: 'newPassword123',
      };
      jest.spyOn(passwordHandler, 'comparePassword').mockResolvedValue(false);

      await expect(service.update('1', updateDto)).rejects.toThrow(BadRequestException);
      expect(mockLogger.warn).toHaveBeenCalledWith("Current password doesn't match");

      const unchangedUser = await repository.findById('1');
      expect(unchangedUser).toEqual(existingUser);
    });

    it('should throw BadRequestException when new password is same as current', async () => {
      const updateDto: UpdateUserDto = {
        password: 'currentPassword123',
        newPassword: 'currentPassword123',
      };
      jest.spyOn(passwordHandler, 'comparePassword').mockResolvedValueOnce(true); // Current password match
      jest.spyOn(passwordHandler, 'comparePassword').mockResolvedValueOnce(true); // New password is same

      await expect(service.update('1', updateDto)).rejects.toThrow(BadRequestException);
      expect(mockLogger.warn).toHaveBeenCalledWith('New password must be different from current password');

      const unchangedUser = await repository.findById('1');
      expect(unchangedUser).toEqual(existingUser);
    });
  });

  describe('remove', () => {
    it('should return null when user not found for deletion', async () => {
      const result = await service.remove('999');

      expect(result).toBeNull();
      expect(mockLogger.warn).toHaveBeenCalledWith('User with ID 999 not found for deletion');
    });

    it('should delete user successfully from repository', async () => {
      const hashedPassword = 'hashedPassword123';
      jest.spyOn(passwordHandler, 'hashPassword').mockResolvedValue(hashedPassword);
      await service.create(mockCreateUserDto);

      const existingUser = await repository.findById('1');
      expect(existingUser).toBeDefined();

      const result = await service.remove('1');

      expect(result).toBeDefined();
      expect(result!.id).toBe('1');
      expect(result!.email).toBe(mockCreateUserDto.email);
      expect(mockLogger.info).toHaveBeenCalledWith(`User deleted: ${mockCreateUserDto.email}`);

      const deletedUser = await repository.findById('1');
      expect(deletedUser).toBeNull();

      const allUsers = await repository.findAll();
      expect(allUsers).toHaveLength(0);
    });

    it('should delete correct user when multiple users exist', async () => {
      const hashedPassword = 'hashedPassword123';
      jest.spyOn(passwordHandler, 'hashPassword').mockResolvedValue(hashedPassword);

      await service.create({ ...mockCreateUserDto, email: 'user1@example.com' });
      await service.create({ ...mockCreateUserDto, email: 'user2@example.com' });
      await service.create({ ...mockCreateUserDto, email: 'user3@example.com' });

      const result = await service.remove('2');

      expect(result).toBeDefined();
      expect(result!.id).toBe('2');
      expect(result!.email).toBe('user2@example.com');

      const allUsers = await repository.findAll();
      expect(allUsers).toHaveLength(2);
      expect(allUsers.find(u => u.id === '1')).toBeDefined();
      expect(allUsers.find(u => u.id === '2')).toBeUndefined();
      expect(allUsers.find(u => u.id === '3')).toBeDefined();
    });
  });

  describe('Integration Flow Tests', () => {
    it('should handle complete user lifecycle: create -> findOne -> update -> delete', async () => {
      const hashedPassword = 'hashedPassword123';
      const newHashedPassword = 'newHashedPassword123';
      jest.spyOn(passwordHandler, 'hashPassword').mockResolvedValueOnce(hashedPassword);

      const createdUser = await service.create(mockCreateUserDto);
      expect(createdUser.id).toBe('1');
      expect(createdUser.password).toBeUndefined();

      const foundUser = await service.findOne('1');
      expect(foundUser).toBeDefined();
      expect(foundUser!.email).toBe(mockCreateUserDto.email);
      expect(foundUser!.password).toBe(hashedPassword);

      jest.spyOn(passwordHandler, 'comparePassword').mockResolvedValueOnce(true);
      jest.spyOn(passwordHandler, 'comparePassword').mockResolvedValueOnce(false);
      jest.spyOn(passwordHandler, 'hashPassword').mockResolvedValueOnce(newHashedPassword);

      const updateDto: UpdateUserDto = {
        name: 'Updated Name',
        password: 'oldPassword123',
        newPassword: 'newPassword123',
      };

      const updatedUser = await service.update('1', updateDto);
      expect(updatedUser!.name).toBe('Updated Name');
      expect(updatedUser!.password).toBeUndefined();

      const userWithNewPassword = await repository.findById('1');
      expect(userWithNewPassword!.password).toBe(newHashedPassword);

      const deletedUser = await service.remove('1');
      expect(deletedUser).toBeDefined();

      const shouldBeNull = await service.findOne('1');
      expect(shouldBeNull).toBeNull();
    });

    it('should maintain data consistency during concurrent operations', async () => {
      const hashedPassword = 'hashedPassword123';
      jest.spyOn(passwordHandler, 'hashPassword').mockResolvedValue(hashedPassword);

      const user1Promise = service.create({ ...mockCreateUserDto, email: 'user1@example.com' });
      const user2Promise = service.create({ ...mockCreateUserDto, email: 'user2@example.com' });
      const user3Promise = service.create({ ...mockCreateUserDto, email: 'user3@example.com' });

      const [user1, user2, user3] = await Promise.all([user1Promise, user2Promise, user3Promise]);

      expect(user1.id).toBe('1');
      expect(user2.id).toBe('2');
      expect(user3.id).toBe('3');

      const allUsers = await repository.findAll();
      expect(allUsers).toHaveLength(3);

      const foundUser1 = await service.findByEmail('user1@example.com');
      const foundUser2 = await service.findByEmail('user2@example.com');
      const foundUser3 = await service.findByEmail('user3@example.com');

      expect(foundUser1).toBeDefined();
      expect(foundUser2).toBeDefined();
      expect(foundUser3).toBeDefined();
    });
  });
});
