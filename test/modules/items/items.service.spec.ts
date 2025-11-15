import { NotFoundException } from '@nestjs/common';
import { ItemsService } from '@/modules/items/items.service';
import { LoggerService } from '@/utils/logger/logger.service';
import { ItemsMemoryRepository } from '@/repositories/in-memory/items.memory.repository';
import { CreateItemDto } from '@/modules/items/dto/create-item.dto';
import { UpdateItemDto } from '@/modules/items/dto/update-item.dto';
import { Item } from '@/types/entities';

describe('ItemsService', () => {
  let service: ItemsService;
  let repository: ItemsMemoryRepository;
  let mockLoggerService: jest.Mocked<LoggerService>;
  let mockLogger: { info: jest.Mock; warn: jest.Mock; error: jest.Mock; };

  const mockUserId = 'user-1';

  const mockCreateItemDto: CreateItemDto = {
    title: 'The Witcher 3',
    type: 'game',
    description: 'Amazing RPG',
    imgUrl: 'https://example.com/witcher3.jpg',
  };

  const mockUpdateItemDto: UpdateItemDto = {
    title: 'The Witcher 3: Wild Hunt',
    description: 'Updated description',
  };

  beforeEach(() => {
    repository = new ItemsMemoryRepository();

    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    mockLoggerService = {
      createEntityLogger: jest.fn().mockReturnValue(mockLogger),
    } as unknown as jest.Mocked<LoggerService>;

    service = new ItemsService(repository, mockLoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    (repository as unknown as { items: Item[]; nextId: number }).items = [];
    (repository as unknown as { items: Item[]; nextId: number }).nextId = 1;
  });

  describe('create', () => {
    it('should create an item successfully and store in repository', async () => {
      const result = await service.create(mockCreateItemDto, mockUserId);

      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.data.id).toBe('1');
      expect(result.data.title).toBe(mockCreateItemDto.title);
      expect(result.data.type).toBe(mockCreateItemDto.type);
      expect(result.data.description).toBe(mockCreateItemDto.description);
      expect(result.data.imgUrl).toBe(mockCreateItemDto.imgUrl);

      const storedItem = await repository.findById('1', mockUserId);
      expect(storedItem).toBeDefined();
      expect(storedItem!.title).toBe(mockCreateItemDto.title);
    });

    it('should create item with only required fields', async () => {
      const minimalDto: CreateItemDto = {
        title: 'Minimal Item',
        type: 'book',
      };

      const result = await service.create(minimalDto, mockUserId);

      expect(result.data.title).toBe(minimalDto.title);
      expect(result.data.type).toBe(minimalDto.type);
      expect(result.data.description).toBeUndefined();
      expect(result.data.imgUrl).toBeUndefined();
    });

    it('should create multiple items with sequential IDs', async () => {
      const item1Dto = { ...mockCreateItemDto, title: 'Item 1' };
      const item2Dto = { ...mockCreateItemDto, title: 'Item 2' };

      const result1 = await service.create(item1Dto, mockUserId);
      const result2 = await service.create(item2Dto, mockUserId);

      expect(result1.data.id).toBe('1');
      expect(result2.data.id).toBe('2');

      const allItems = await repository.findAll({ userId: mockUserId });
      expect(allItems.data).toHaveLength(2);
      expect(allItems.data[0].title).toBe('Item 1');
      expect(allItems.data[1].title).toBe('Item 2');
    });

    it('should test all valid item types', async () => {
      const types: ('game' | 'book' | 'serie' | 'movie' | 'course')[] =
        ['game', 'book', 'serie', 'movie', 'course'];

      for (const type of types) {
        const dto = { ...mockCreateItemDto, title: `Test ${type}`, type };
        const result = await service.create(dto, mockUserId);
        expect(result.data.type).toBe(type);
      }

      const allItems = await repository.findAll({ userId: mockUserId });
      expect(allItems.data).toHaveLength(5);
    });
  });

  describe('findAll', () => {
    it('should return empty result when no items exist', async () => {
      const result = await service.findAll({ userId: mockUserId });

      expect(result.data).toEqual([]);
      expect(result.totalItems).toBe(0);
      expect(result.totalPages).toBe(0);
      expect(result.currentPage).toBe(1);
      expect(result.isFirstPage).toBe(true);
      expect(result.isLastPage).toBe(true);
      expect(mockLogger.info).toHaveBeenCalledWith('Found 0 items');
    });

    it('should return all items with default pagination', async () => {
      await service.create({ ...mockCreateItemDto, title: 'Item 1' }, mockUserId);
      await service.create({ ...mockCreateItemDto, title: 'Item 2' }, mockUserId);

      const result = await service.findAll({ userId: mockUserId });

      expect(result.data).toHaveLength(2);
      expect(result.totalItems).toBe(2);
      expect(result.totalPages).toBe(1);
      expect(result.currentPage).toBe(1);
      expect(result.isFirstPage).toBe(true);
      expect(result.isLastPage).toBe(true);
      expect(mockLogger.info).toHaveBeenCalledWith('Found 2 items');
    });

    it('should handle pagination correctly', async () => {
      // Create 5 items
      for (let i = 1; i <= 5; i++) {
        await service.create({ ...mockCreateItemDto, title: `Item ${i}` }, mockUserId);
      }

      const result = await service.findAll({ limit: 2, page: 2, userId: mockUserId });

      expect(result.data).toHaveLength(2);
      expect(result.totalItems).toBe(5);
      expect(result.totalPages).toBe(3);
      expect(result.currentPage).toBe(2);
      expect(result.isFirstPage).toBe(false);
      expect(result.isLastPage).toBe(false);
    });

    it('should handle last page correctly', async () => {
      for (let i = 1; i <= 3; i++) {
        await service.create({ ...mockCreateItemDto, title: `Item ${i}` }, mockUserId);
      }

      const result = await service.findAll({ limit: 2, page: 2, userId: mockUserId });

      expect(result.data).toHaveLength(1);
      expect(result.currentPage).toBe(2);
      expect(result.isLastPage).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException when item does not exist', async () => {
      await expect(service.findOne('999', mockUserId)).rejects.toThrow(NotFoundException);
      expect(mockLogger.warn).toHaveBeenCalledWith('Item with ID 999 not found');
    });

    it('should return item when found in repository', async () => {
      await service.create(mockCreateItemDto, mockUserId);

      const result = await service.findOne('1', mockUserId);

      expect(result.data).toBeDefined();
      expect(result.data.id).toBe('1');
      expect(result.data.title).toBe(mockCreateItemDto.title);
      expect(mockLogger.info).toHaveBeenCalledWith(`Item found: ${mockCreateItemDto.title}`);
    });
  });

  describe('update', () => {
    beforeEach(async () => {
      await service.create(mockCreateItemDto, mockUserId);
    });

    it('should throw NotFoundException when item not found for update', async () => {
      await expect(service.update('999', mockUpdateItemDto)).rejects.toThrow(NotFoundException);
      expect(mockLogger.warn).toHaveBeenCalledWith('Item with ID 999 not found for update');
    });

    it('should update item successfully', async () => {
      const result = await service.update('1', mockUpdateItemDto);

      expect(result.data).toBeDefined();
      expect(result.data!.title).toBe(mockUpdateItemDto.title);
      expect(result.data!.description).toBe(mockUpdateItemDto.description);
      expect(result.data!.type).toBe(mockCreateItemDto.type); // Should keep original type

      const updatedItem = await repository.findById('1', mockUserId);
      expect(updatedItem!.title).toBe(mockUpdateItemDto.title);
      expect(updatedItem!.description).toBe(mockUpdateItemDto.description);
    });

    it('should update only provided fields', async () => {
      const partialUpdate: UpdateItemDto = { title: 'New Title Only' };

      const result = await service.update('1', partialUpdate);

      expect(result.data!.title).toBe('New Title Only');
      expect(result.data!.type).toBe(mockCreateItemDto.type);
      expect(result.data!.description).toBe(mockCreateItemDto.description);
      expect(result.data!.imgUrl).toBe(mockCreateItemDto.imgUrl);
    });

    it('should handle clearing optional fields', async () => {
      const clearUpdate: UpdateItemDto = { description: undefined, imgUrl: undefined };

      const result = await service.update('1', clearUpdate);

      expect(result.data!.description).toBeUndefined();
      expect(result.data!.imgUrl).toBeUndefined();
      expect(result.data!.title).toBe(mockCreateItemDto.title);
    });
  });

  describe('remove', () => {
    it('should return null data when item not found for deletion', async () => {
      const result = await service.remove('999');

      expect(result.data).toBeNull();
      expect(mockLogger.warn).toHaveBeenCalledWith('Item with ID 999 not found for deletion');
    });

    it('should delete item successfully from repository', async () => {
      await service.create(mockCreateItemDto, mockUserId);

      const existingItem = await repository.findById('1', mockUserId);
      expect(existingItem).toBeDefined();

      const result = await service.remove('1');

      expect(result.data).toBeDefined();
      expect(result.data!.id).toBe('1');
      expect(result.data!.title).toBe(mockCreateItemDto.title);
      expect(mockLogger.info).toHaveBeenCalledWith(`Item deleted: ${mockCreateItemDto.title}`);

      const deletedItem = await repository.findById('1', mockUserId);
      expect(deletedItem).toBeNull();

      const allItems = await repository.findAll({ userId: mockUserId });
      expect(allItems.data).toHaveLength(0);
    });

    it('should delete correct item when multiple items exist', async () => {
      await service.create({ ...mockCreateItemDto, title: 'Item 1' }, mockUserId);
      await service.create({ ...mockCreateItemDto, title: 'Item 2' }, mockUserId);
      await service.create({ ...mockCreateItemDto, title: 'Item 3' }, mockUserId);

      const result = await service.remove('2');

      expect(result.data).toBeDefined();
      expect(result.data!.id).toBe('2');
      expect(result.data!.title).toBe('Item 2');

      const allItems = await repository.findAll({ userId: mockUserId });
      expect(allItems.data).toHaveLength(2);
      expect(allItems.data.find(i => i.id === '1')).toBeDefined();
      expect(allItems.data.find(i => i.id === '2')).toBeUndefined();
      expect(allItems.data.find(i => i.id === '3')).toBeDefined();
    });
  });

  describe('Integration Flow Tests', () => {
    it('should handle complete item lifecycle: create -> findOne -> update -> delete', async () => {
      const createdItem = await service.create(mockCreateItemDto, mockUserId);
      expect(createdItem.data.id).toBe('1');

      const foundItem = await service.findOne('1', mockUserId);
      expect(foundItem.data).toBeDefined();
      expect(foundItem.data.title).toBe(mockCreateItemDto.title);

      const updatedItem = await service.update('1', mockUpdateItemDto);
      expect(updatedItem.data!.title).toBe(mockUpdateItemDto.title);

      const deletedItem = await service.remove('1');
      expect(deletedItem.data).toBeDefined();

      await expect(service.findOne('1', mockUserId)).rejects.toThrow(NotFoundException);
    });

    it('should maintain data consistency during concurrent operations', async () => {
      const item1Promise = service.create({ ...mockCreateItemDto, title: 'Item 1' }, mockUserId);
      const item2Promise = service.create({ ...mockCreateItemDto, title: 'Item 2' }, mockUserId);
      const item3Promise = service.create({ ...mockCreateItemDto, title: 'Item 3' }, mockUserId);

      const [item1, item2, item3] = await Promise.all([item1Promise, item2Promise, item3Promise]);

      expect(item1.data.id).toBe('1');
      expect(item2.data.id).toBe('2');
      expect(item3.data.id).toBe('3');

      const allItems = await repository.findAll({ userId: mockUserId });
      expect(allItems.data).toHaveLength(3);

      const foundItem1 = await service.findOne('1', mockUserId);
      const foundItem2 = await service.findOne('2', mockUserId);
      const foundItem3 = await service.findOne('3', mockUserId);

      expect(foundItem1.data.title).toBe('Item 1');
      expect(foundItem2.data.title).toBe('Item 2');
      expect(foundItem3.data.title).toBe('Item 3');
    });

    it('should handle mixed operations correctly', async () => {
      // Create items
      await service.create({ ...mockCreateItemDto, title: 'Item 1' }, mockUserId);
      await service.create({ ...mockCreateItemDto, title: 'Item 2' }, mockUserId);
      await service.create({ ...mockCreateItemDto, title: 'Item 3' }, mockUserId);

      // Update one
      await service.update('2', { title: 'Updated Item 2' });

      // Delete one
      await service.remove('3');

      // Verify final state
      const allItems = await service.findAll({ userId: mockUserId });
      expect(allItems.data).toHaveLength(2);
      expect(allItems.data[0].title).toBe('Item 1');
      expect(allItems.data[1].title).toBe('Updated Item 2');

      // Verify deleted item is gone
      await expect(service.findOne('3', mockUserId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string values correctly', async () => {
      const emptyStringDto: CreateItemDto = {
        title: 'Valid Title',
        type: 'book',
        description: '',
        imgUrl: '',
      };

      const result = await service.create(emptyStringDto, mockUserId);
      expect(result.data.description).toBe('');
      expect(result.data.imgUrl).toBe('');
    });

    it('should handle pagination edge cases', async () => {
      // Test page beyond available data
      const result = await service.findAll({ limit: 10, page: 999, userId: mockUserId });
      expect(result.data).toHaveLength(0);
      expect(result.currentPage).toBe(999);
      expect(result.isLastPage).toBe(true);
    });

    it('should handle very large pagination limits', async () => {
      await service.create(mockCreateItemDto, mockUserId);

      const result = await service.findAll({ limit: 1000, page: 1, userId: mockUserId });
      expect(result.data).toHaveLength(1);
      expect(result.totalPages).toBe(1);
      expect(result.isLastPage).toBe(true);
    });
  });
});