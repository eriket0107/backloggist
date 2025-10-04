import { NotFoundException, ConflictException } from '@nestjs/common';
import { ItemGenresService } from '@/modules/item-genres/item-genres.service';
import { LoggerService } from '@/utils/logger/logger.service';
import { ItemGenresMemoryRepository } from '@/repositories/in-memory/item-genres.memory.repository';
import { ItemsMemoryRepository } from '@/repositories/in-memory/items.memory.repository';
import { GenresMemoryRepository } from '@/repositories/in-memory/genres.memory.repository';
import { Item, Genre } from '@/types/entities';

describe('ItemGenresService', () => {
  let service: ItemGenresService;
  let itemGenresRepository: ItemGenresMemoryRepository;
  let itemsRepository: ItemsMemoryRepository;
  let genresRepository: GenresMemoryRepository;
  let mockLoggerService: jest.Mocked<LoggerService>;
  let mockLogger: { info: jest.Mock; warn: jest.Mock; error: jest.Mock; };

  const mockItem: Item = {
    id: 'item-1',
    title: 'Test Item',
    type: 'game',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockGenre: Genre = {
    id: 'genre-1',
    name: 'Action',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    itemGenresRepository = new ItemGenresMemoryRepository();
    itemsRepository = new ItemsMemoryRepository();
    genresRepository = new GenresMemoryRepository();

    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    mockLoggerService = {
      createEntityLogger: jest.fn().mockReturnValue(mockLogger),
    } as unknown as jest.Mocked<LoggerService>;

    service = new ItemGenresService(
      itemGenresRepository,
      itemsRepository,
      genresRepository,
      mockLoggerService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    (itemGenresRepository as unknown as { itemGenres: unknown[]; nextId: number }).itemGenres = [];
    (itemGenresRepository as unknown as { itemGenres: unknown[]; nextId: number }).nextId = 1;
    (itemsRepository as unknown as { items: unknown[]; nextId: number }).items = [];
    (itemsRepository as unknown as { items: unknown[]; nextId: number }).nextId = 1;
    (genresRepository as unknown as { genres: unknown[]; nextId: number }).genres = [];
    (genresRepository as unknown as { genres: unknown[]; nextId: number }).nextId = 1;
  });

  const setupTestData = async () => {
    const createdItem = await itemsRepository.create(mockItem);
    const createdGenre = await genresRepository.create(mockGenre);
    return { itemId: createdItem.id, genreId: createdGenre.id };
  };

  describe('create', () => {
    it('should create item-genre relationship successfully', async () => {
      const { itemId, genreId } = await setupTestData();
      const createDto = { itemId, genreId };
      const result = await service.create(createDto);

      expect(result.data.itemId).toBe(itemId);
      expect(result.data.genreId).toBe(genreId);
      expect(result.data.id).toBe('1');
    });

    it('should throw NotFoundException when item does not exist', async () => {
      await genresRepository.create(mockGenre);
      const invalidDto = { itemId: 'invalid-item', genreId: '1' };

      await expect(service.create(invalidDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when genre does not exist', async () => {
      await itemsRepository.create(mockItem);
      const invalidDto = { itemId: '1', genreId: 'invalid-genre' };

      await expect(service.create(invalidDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when relationship already exists', async () => {
      const { itemId, genreId } = await setupTestData();
      const createDto = { itemId, genreId };
      await service.create(createDto);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return empty result when no relationships exist', async () => {
      const result = await service.findAll({});

      expect(result.data).toEqual([]);
    });

    it('should return all relationships', async () => {
      const { itemId, genreId } = await setupTestData();
      const createDto = { itemId, genreId };
      await service.create(createDto);

      const result = await service.findAll({});

      expect(result.data).toHaveLength(1);
      expect(result.data[0].itemId).toBe(itemId);
      expect(result.data[0].genreId).toBe(genreId);
    });

    it('should filter by itemId', async () => {
      const { itemId, genreId } = await setupTestData();
      const createDto = { itemId, genreId };
      await service.create(createDto);

      const result = await service.findAll({ itemId });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].itemId).toBe(itemId);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException when relationship does not exist', async () => {
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });

    it('should return relationship when found', async () => {
      const { itemId, genreId } = await setupTestData();
      const createDto = { itemId, genreId };
      await service.create(createDto);

      const result = await service.findOne('1');

      expect(result.data.itemId).toBe(itemId);
      expect(result.data.genreId).toBe(genreId);
    });
  });

  describe('remove', () => {
    it('should return null when relationship not found', async () => {
      const result = await service.remove('999');

      expect(result.data).toBeNull();
    });

    it('should delete relationship successfully', async () => {
      const { itemId, genreId } = await setupTestData();
      const createDto = { itemId, genreId };
      await service.create(createDto);

      const result = await service.remove('1');

      expect(result.data).toBeDefined();
      expect(result.data!.id).toBe('1');
    });
  });
});
