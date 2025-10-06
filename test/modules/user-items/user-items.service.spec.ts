import { UserItemsService } from '@/modules/user-items/user-items.service';
import { LoggerService } from '@/utils/logger/logger.service';
import { UserItemsMemoryRepository } from '@/repositories/in-memory/user-items.memory.repository';
import { AddToBacklogDto } from '@/modules/user-items/dto/add-to-backlog.dto';
import { UpdateUserItemDto } from '@/modules/user-items/dto/update-user-item.dto';

describe('UserItemsService', () => {
  let service: UserItemsService;
  let userItemsRepository: UserItemsMemoryRepository;
  let mockLoggerService: jest.Mocked<LoggerService>;
  let mockLogger: { info: jest.Mock; warn: jest.Mock; error: jest.Mock; };

  const mockUserId = 'user-1';
  const mockItemId = 'item-1';

  beforeEach(() => {
    userItemsRepository = new UserItemsMemoryRepository();

    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    mockLoggerService = {
      createEntityLogger: jest.fn().mockReturnValue(mockLogger),
    } as unknown as jest.Mocked<LoggerService>;

    service = new UserItemsService(
      userItemsRepository,
      mockLoggerService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    (userItemsRepository as unknown as { userItems: unknown[]; nextId: number }).userItems = [];
    (userItemsRepository as unknown as { userItems: unknown[]; nextId: number }).nextId = 1;
  });

  describe('addToBacklog', () => {
    it('should add item to backlog successfully with default status', async () => {
      const addToBacklogDto: AddToBacklogDto = {
        itemId: mockItemId,
      };

      const result = await service.addToBacklog(mockUserId, addToBacklogDto);

      expect(result.data).toBeDefined();
      expect(result.data.userId).toBe(mockUserId);
      expect(result.data.itemId).toBe(mockItemId);
      expect(result.data.status).toBe('pending');
      expect(result.data.id).toBe('1');
      expect(mockLogger.info).toHaveBeenCalledWith(`Adding item ${mockItemId} to user ${mockUserId} backlog`);
      expect(mockLogger.info).toHaveBeenCalledWith(`Item added to backlog with ID: ${result.data.id}`);
    });

    it('should add item to backlog with custom status', async () => {
      const addToBacklogDto: AddToBacklogDto = {
        itemId: mockItemId,
        status: 'in_progress',
      };

      const result = await service.addToBacklog(mockUserId, addToBacklogDto);

      expect(result.data).toBeDefined();
      expect(result.data.status).toBe('in_progress');
    });

    it('should add item to backlog with completed status', async () => {
      const addToBacklogDto: AddToBacklogDto = {
        itemId: mockItemId,
        status: 'completed',
      };

      const result = await service.addToBacklog(mockUserId, addToBacklogDto);

      expect(result.data).toBeDefined();
      expect(result.data.status).toBe('completed');
    });
  });

  describe('getUserBacklog', () => {
    it('should return empty backlog when user has no items', async () => {
      const result = await service.getUserBacklog({
        userId: mockUserId,
        page: 1,
        limit: 10,
      });

      expect(result.data).toEqual([]);
      expect(result.totalItems).toBe(0);
      expect(result.totalPages).toBe(0);
      expect(mockLogger.info).toHaveBeenCalledWith(`Fetching backlog for user ${mockUserId}`);
      expect(mockLogger.info).toHaveBeenCalledWith(`Found 0 items in user backlog`);
    });

    it('should return user backlog with items', async () => {
      // Add items to backlog first
      await userItemsRepository.create({
        userId: mockUserId,
        itemId: 'item-1',
        status: 'pending',
        addedAt: new Date(),
      });
      await userItemsRepository.create({
        userId: mockUserId,
        itemId: 'item-2',
        status: 'in_progress',
        addedAt: new Date(),
      });

      const result = await service.getUserBacklog({
        userId: mockUserId,
        page: 1,
        limit: 10,
      });

      expect(result.data).toHaveLength(2);
      expect(result.totalItems).toBe(2);
      expect(result.totalPages).toBe(1);
      expect(mockLogger.info).toHaveBeenCalledWith(`Found 2 items in user backlog`);
    });

    it('should filter by type', async () => {
      await userItemsRepository.create({
        userId: mockUserId,
        itemId: 'item-1',
        status: 'pending',
        addedAt: new Date(),
      });

      const result = await service.getUserBacklog({
        userId: mockUserId,
        page: 1,
        limit: 10,
        type: 'game',
      });

      expect(result.data).toHaveLength(1);
    });

    it('should filter by search term', async () => {
      await userItemsRepository.create({
        userId: mockUserId,
        itemId: 'item-1',
        status: 'pending',
        addedAt: new Date(),
      });

      const result = await service.getUserBacklog({
        userId: mockUserId,
        page: 1,
        limit: 10,
        search: 'Mock Item item-1',
      });

      expect(result.data).toHaveLength(1);
    });

    it('should handle pagination correctly', async () => {
      // Add multiple items
      for (let i = 1; i <= 15; i++) {
        await userItemsRepository.create({
          userId: mockUserId,
          itemId: `item-${i}`,
          status: 'pending',
          addedAt: new Date(),
        });
      }

      const result = await service.getUserBacklog({
        userId: mockUserId,
        page: 2,
        limit: 10,
      });

      expect(result.data).toHaveLength(5);
      expect(result.totalItems).toBe(15);
      expect(result.totalPages).toBe(2);
      expect(result.currentPage).toBe(2);
      expect(result.isFirstPage).toBe(false);
      expect(result.isLastPage).toBe(true);
    });
  });

  describe('updateUserItem', () => {
    it('should update user item successfully', async () => {
      // Create a user item first
      const createdItem = await userItemsRepository.create({
        userId: mockUserId,
        itemId: mockItemId,
        status: 'pending',
        addedAt: new Date(),
      });

      const updateDto: UpdateUserItemDto = {
        status: 'in_progress',
        rating: 5,
        order: 1,
      };

      const result = await service.updateUserItem(mockUserId, createdItem.id, updateDto);

      expect(result.data).toBeDefined();
      expect(result.data!.status).toBe('in_progress');
      expect(result.data!.rating).toBe(5);
      expect(result.data!.order).toBe(1);
      expect(mockLogger.info).toHaveBeenCalledWith(`Updating user item for user ${mockUserId}, item ${createdItem.id}`);
      expect(mockLogger.info).toHaveBeenCalledWith(`User item updated: ${result.data!.id}`);
    });

    it('should return null when user item not found', async () => {
      const updateDto: UpdateUserItemDto = {
        status: 'in_progress',
      };

      const result = await service.updateUserItem(mockUserId, 'non-existent-id', updateDto);

      expect(result.data).toBeNull();
      expect(mockLogger.warn).toHaveBeenCalledWith(`User item not found for user ${mockUserId}, item non-existent-id`);
    });

    it('should update only provided fields', async () => {
      const createdItem = await userItemsRepository.create({
        userId: mockUserId,
        itemId: mockItemId,
        status: 'pending',
        addedAt: new Date(),
      });

      const updateDto: UpdateUserItemDto = {
        status: 'completed',
      };

      const result = await service.updateUserItem(mockUserId, createdItem.id, updateDto);

      expect(result.data).toBeDefined();
      expect(result.data!.status).toBe('completed');
    });
  });

  describe('removeFromBacklog', () => {
    it('should remove item from backlog successfully', async () => {
      const createdItem = await userItemsRepository.create({
        userId: mockUserId,
        itemId: mockItemId,
        status: 'pending',
        addedAt: new Date(),
      });

      const result = await service.removeFromBacklog(mockUserId, createdItem.id);

      expect(result.data).toBeDefined();
      expect(result.data!.id).toBe(createdItem.id);
      expect(mockLogger.info).toHaveBeenCalledWith(`Removing item ${createdItem.id} from user ${mockUserId} backlog`);
      expect(mockLogger.info).toHaveBeenCalledWith(`Item removed from backlog: ${result.data!.id}`);
    });

    it('should return null when item not found for removal', async () => {
      const result = await service.removeFromBacklog(mockUserId, 'non-existent-id');

      expect(result.data).toBeNull();
      expect(mockLogger.warn).toHaveBeenCalledWith(`User item not found for deletion: user ${mockUserId}, item non-existent-id`);
    });
  });

  describe('getBacklogStats', () => {
    it('should return empty stats when user has no items', async () => {
      const result = await service.getBacklogStats(mockUserId);

      expect(result.data).toEqual({
        total: 0,
        completed: 0,
        in_progress: 0,
        pending: 0,
      });
      expect(mockLogger.info).toHaveBeenCalledWith(`Fetching backlog stats for user ${mockUserId}`);
      expect(mockLogger.info).toHaveBeenCalledWith(`Backlog stats: ${JSON.stringify(result.data)}`);
    });

    it('should return correct stats for user with items', async () => {
      // Add items with different statuses
      await userItemsRepository.create({
        userId: mockUserId,
        itemId: 'item-1',
        status: 'pending',
        addedAt: new Date(),
      });
      await userItemsRepository.create({
        userId: mockUserId,
        itemId: 'item-2',
        status: 'in_progress',
        addedAt: new Date(),
      });
      await userItemsRepository.create({
        userId: mockUserId,
        itemId: 'item-3',
        status: 'completed',
        addedAt: new Date(),
      });
      await userItemsRepository.create({
        userId: mockUserId,
        itemId: 'item-4',
        status: 'completed',
        addedAt: new Date(),
      });

      const result = await service.getBacklogStats(mockUserId);

      expect(result.data).toEqual({
        total: 4,
        completed: 2,
        in_progress: 1,
        pending: 1,
      });
    });

    it('should return stats for specific user only', async () => {
      const otherUserId = 'user-2';

      // Add items for different users
      await userItemsRepository.create({
        userId: mockUserId,
        itemId: 'item-1',
        status: 'pending',
        addedAt: new Date(),
      });
      await userItemsRepository.create({
        userId: otherUserId,
        itemId: 'item-2',
        status: 'completed',
        addedAt: new Date(),
      });

      const result = await service.getBacklogStats(mockUserId);

      expect(result.data.total).toBe(1);
      expect(result.data.pending).toBe(1);
      expect(result.data.completed).toBe(0);
    });
  });
});
