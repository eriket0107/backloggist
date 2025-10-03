import { ConflictException, NotFoundException } from '@nestjs/common';
import { GenresService } from '@/modules/genres/genres.service';
import { LoggerService } from '@/utils/logger/logger.service';
import { GenresMemoryRepository } from '@/repositories/in-memory/genres.memory.repository';
import { CreateGenreDto } from '@/modules/genres/dto/create-genre.dto';
import { UpdateGenreDto } from '@/modules/genres/dto/update-genre.dto';
import { Genre } from '@/types/entities';

describe('GenresService', () => {
  let service: GenresService;
  let repository: GenresMemoryRepository;
  let mockLoggerService: jest.Mocked<LoggerService>;
  let mockLogger: { info: jest.Mock; warn: jest.Mock; error: jest.Mock; };

  const mockCreateGenreDto: CreateGenreDto = {
    name: 'Action',
  };

  const mockUpdateGenreDto: UpdateGenreDto = {
    name: 'Adventure',
  };

  beforeEach(() => {
    repository = new GenresMemoryRepository();

    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    mockLoggerService = {
      createEntityLogger: jest.fn().mockReturnValue(mockLogger),
    } as unknown as jest.Mocked<LoggerService>;

    service = new GenresService(repository, mockLoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    (repository as unknown as { genres: Genre[]; nextId: number }).genres = [];
    (repository as unknown as { genres: Genre[]; nextId: number }).nextId = 1;
  });

  describe('create', () => {
    it('should create a genre successfully and store in repository', async () => {
      const result = await service.create(mockCreateGenreDto);

      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.data.id).toBe('1');
      expect(result.data.name).toBe(mockCreateGenreDto.name);
      expect(result.data.createdAt).toBeInstanceOf(Date);
      expect(result.data.updatedAt).toBeInstanceOf(Date);

      const storedGenre = await repository.findById('1');
      expect(storedGenre).toBeDefined();
      expect(storedGenre!.name).toBe(mockCreateGenreDto.name);
    });

    it('should throw ConflictException when genre name already exists', async () => {
      await service.create(mockCreateGenreDto);

      await expect(service.create(mockCreateGenreDto)).rejects.toThrow(ConflictException);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        `Genre with name '${mockCreateGenreDto.name}' already exists`
      );

      const allGenres = await repository.findAll({});
      expect(allGenres.data).toHaveLength(1);
    });

    it('should throw ConflictException for case-insensitive name collision', async () => {
      await service.create(mockCreateGenreDto);

      const upperCaseDto = { name: mockCreateGenreDto.name.toUpperCase() };
      await expect(service.create(upperCaseDto)).rejects.toThrow(ConflictException);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        `Genre with name '${upperCaseDto.name}' already exists`
      );
    });

    it('should create multiple genres with sequential IDs', async () => {
      const genre1Dto = { name: 'Action' };
      const genre2Dto = { name: 'Comedy' };

      const result1 = await service.create(genre1Dto);
      const result2 = await service.create(genre2Dto);

      expect(result1.data.id).toBe('1');
      expect(result2.data.id).toBe('2');

      const allGenres = await repository.findAll({});
      expect(allGenres.data).toHaveLength(2);
      expect(allGenres.data.find(g => g.name === 'Action')).toBeDefined();
      expect(allGenres.data.find(g => g.name === 'Comedy')).toBeDefined();
    });

    it('should log creation process correctly', async () => {
      const result = await service.create(mockCreateGenreDto);

      expect(mockLogger.info).toHaveBeenCalledWith('Creating new genre');
      expect(mockLogger.info).toHaveBeenCalledWith(`Genre created with ID: ${result.data.id}`);
    });
  });

  describe('findAll', () => {
    it('should return empty result when no genres exist', async () => {
      const result = await service.findAll();

      expect(result.data).toEqual([]);
      expect(result.totalItems).toBe(0);
      expect(result.totalPages).toBe(0);
      expect(result.currentPage).toBe(1);
      expect(result.isFirstPage).toBe(true);
      expect(result.isLastPage).toBe(true);
      expect(mockLogger.info).toHaveBeenCalledWith('Found 0 genres');
    });

    it('should return all genres with default pagination', async () => {
      await service.create({ name: 'Action' });
      await service.create({ name: 'Comedy' });

      const result = await service.findAll();

      expect(result.data).toHaveLength(2);
      expect(result.totalItems).toBe(2);
      expect(result.totalPages).toBe(1);
      expect(result.currentPage).toBe(1);
      expect(result.isFirstPage).toBe(true);
      expect(result.isLastPage).toBe(true);
      expect(mockLogger.info).toHaveBeenCalledWith('Found 2 genres');
    });

    it('should handle pagination correctly', async () => {
      // Create 5 genres
      const genreNames = ['Action', 'Comedy', 'Drama', 'Horror', 'Thriller'];
      for (const name of genreNames) {
        await service.create({ name });
      }

      const result = await service.findAll({ limit: 2, page: 2 });

      expect(result.data).toHaveLength(2);
      expect(result.totalItems).toBe(5);
      expect(result.totalPages).toBe(3);
      expect(result.currentPage).toBe(2);
      expect(result.isFirstPage).toBe(false);
      expect(result.isLastPage).toBe(false);
    });

    it('should handle last page correctly', async () => {
      await service.create({ name: 'Action' });
      await service.create({ name: 'Comedy' });
      await service.create({ name: 'Drama' });

      const result = await service.findAll({ limit: 2, page: 2 });

      expect(result.data).toHaveLength(1);
      expect(result.currentPage).toBe(2);
      expect(result.isLastPage).toBe(true);
    });

    it('should return genres sorted alphabetically', async () => {
      await service.create({ name: 'Thriller' });
      await service.create({ name: 'Action' });
      await service.create({ name: 'Comedy' });

      const result = await service.findAll();

      expect(result.data).toHaveLength(3);
      expect(result.data[0].name).toBe('Action');
      expect(result.data[1].name).toBe('Comedy');
      expect(result.data[2].name).toBe('Thriller');
    });

    it('should use default pagination values when not provided', async () => {
      // Create 15 genres to test default limit
      for (let i = 1; i <= 15; i++) {
        await service.create({ name: `Genre ${i.toString().padStart(2, '0')}` });
      }

      const result = await service.findAll();

      expect(result.data).toHaveLength(10); // Default limit
      expect(result.currentPage).toBe(1); // Default page
      expect(result.totalItems).toBe(15);
      expect(result.totalPages).toBe(2);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException when genre does not exist', async () => {
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
      expect(mockLogger.warn).toHaveBeenCalledWith('Genre with ID 999 not found');
    });

    it('should return genre when found in repository', async () => {
      await service.create(mockCreateGenreDto);

      const result = await service.findOne('1');

      expect(result.data).toBeDefined();
      expect(result.data.id).toBe('1');
      expect(result.data.name).toBe(mockCreateGenreDto.name);
      expect(mockLogger.info).toHaveBeenCalledWith(`Genre found: ${mockCreateGenreDto.name}`);
    });

    it('should log the search process correctly', async () => {
      await service.create(mockCreateGenreDto);

      await service.findOne('1');

      expect(mockLogger.info).toHaveBeenCalledWith('Fetching genre with ID: 1');
      expect(mockLogger.info).toHaveBeenCalledWith(`Genre found: ${mockCreateGenreDto.name}`);
    });
  });

  describe('update', () => {
    beforeEach(async () => {
      await service.create(mockCreateGenreDto);
    });

    it('should throw NotFoundException when genre not found for update', async () => {
      await expect(service.update('999', mockUpdateGenreDto)).rejects.toThrow(NotFoundException);
      expect(mockLogger.warn).toHaveBeenCalledWith('Genre with ID 999 not found for update');
    });

    it('should update genre successfully', async () => {
      // Add a small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 1));

      const result = await service.update('1', mockUpdateGenreDto);

      expect(result.data).toBeDefined();
      expect(result.data!.name).toBe(mockUpdateGenreDto.name);
      expect(result.data!.id).toBe('1');

      const updatedGenre = await repository.findById('1');
      expect(updatedGenre!.name).toBe(mockUpdateGenreDto.name);
      expect(updatedGenre!.updatedAt.getTime()).toBeGreaterThanOrEqual(updatedGenre!.createdAt.getTime());
    });

    it('should throw ConflictException when updating to existing genre name', async () => {
      await service.create({ name: 'Comedy' });

      await expect(service.update('1', { name: 'Comedy' })).rejects.toThrow(ConflictException);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        "Genre with name 'Comedy' already exists"
      );

      // Original genre should remain unchanged
      const originalGenre = await repository.findById('1');
      expect(originalGenre!.name).toBe(mockCreateGenreDto.name);
    });

    it('should allow updating genre with same name (no change)', async () => {
      const result = await service.update('1', { name: mockCreateGenreDto.name });

      expect(result.data).toBeDefined();
      expect(result.data!.name).toBe(mockCreateGenreDto.name);
      expect(mockLogger.info).toHaveBeenCalledWith(`Genre updated: ${mockCreateGenreDto.name}`);
    });

    it('should handle case-insensitive name conflict check', async () => {
      await service.create({ name: 'Comedy' });

      await expect(service.update('1', { name: 'COMEDY' })).rejects.toThrow(ConflictException);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        "Genre with name 'COMEDY' already exists"
      );
    });

    it('should update with undefined name (no change)', async () => {
      const result = await service.update('1', {});

      expect(result.data).toBeDefined();
      expect(result.data!.name).toBe(mockCreateGenreDto.name);
    });

    it('should log update process correctly', async () => {
      await service.update('1', mockUpdateGenreDto);

      expect(mockLogger.info).toHaveBeenCalledWith('Updating genre with ID: 1');
      expect(mockLogger.info).toHaveBeenCalledWith(`Genre updated: ${mockUpdateGenreDto.name}`);
    });
  });

  describe('remove', () => {
    it('should return null data when genre not found for deletion', async () => {
      const result = await service.remove('999');

      expect(result.data).toBeNull();
      expect(mockLogger.warn).toHaveBeenCalledWith('Genre with ID 999 not found for deletion');
    });

    it('should delete genre successfully from repository', async () => {
      await service.create(mockCreateGenreDto);

      const existingGenre = await repository.findById('1');
      expect(existingGenre).toBeDefined();

      const result = await service.remove('1');

      expect(result.data).toBeDefined();
      expect(result.data!.id).toBe('1');
      expect(result.data!.name).toBe(mockCreateGenreDto.name);
      expect(mockLogger.info).toHaveBeenCalledWith(`Genre deleted: ${mockCreateGenreDto.name}`);

      const deletedGenre = await repository.findById('1');
      expect(deletedGenre).toBeNull();

      const allGenres = await repository.findAll({});
      expect(allGenres.data).toHaveLength(0);
    });

    it('should delete correct genre when multiple genres exist', async () => {
      await service.create({ name: 'Action' });
      await service.create({ name: 'Comedy' });
      await service.create({ name: 'Drama' });

      const result = await service.remove('2');

      expect(result.data).toBeDefined();
      expect(result.data!.id).toBe('2');
      expect(result.data!.name).toBe('Comedy');

      const allGenres = await repository.findAll({});
      expect(allGenres.data).toHaveLength(2);
      expect(allGenres.data.find(g => g.id === '1')).toBeDefined();
      expect(allGenres.data.find(g => g.id === '2')).toBeUndefined();
      expect(allGenres.data.find(g => g.id === '3')).toBeDefined();
    });

    it('should log deletion process correctly', async () => {
      await service.create(mockCreateGenreDto);

      await service.remove('1');

      expect(mockLogger.info).toHaveBeenCalledWith('Deleting genre with ID: 1');
      expect(mockLogger.info).toHaveBeenCalledWith(`Genre deleted: ${mockCreateGenreDto.name}`);
    });
  });

  describe('Integration Flow Tests', () => {
    it('should handle complete genre lifecycle: create -> findOne -> update -> delete', async () => {
      const createdGenre = await service.create(mockCreateGenreDto);
      expect(createdGenre.data.id).toBe('1');

      const foundGenre = await service.findOne('1');
      expect(foundGenre.data).toBeDefined();
      expect(foundGenre.data.name).toBe(mockCreateGenreDto.name);

      const updatedGenre = await service.update('1', mockUpdateGenreDto);
      expect(updatedGenre.data!.name).toBe(mockUpdateGenreDto.name);

      const deletedGenre = await service.remove('1');
      expect(deletedGenre.data).toBeDefined();

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });

    it('should maintain data consistency during concurrent operations', async () => {
      const genre1Promise = service.create({ name: 'Action' });
      const genre2Promise = service.create({ name: 'Comedy' });
      const genre3Promise = service.create({ name: 'Drama' });

      const [genre1, genre2, genre3] = await Promise.all([genre1Promise, genre2Promise, genre3Promise]);

      expect(genre1.data.id).toBe('1');
      expect(genre2.data.id).toBe('2');
      expect(genre3.data.id).toBe('3');

      const allGenres = await repository.findAll({});
      expect(allGenres.data).toHaveLength(3);

      const foundGenre1 = await service.findOne('1');
      const foundGenre2 = await service.findOne('2');
      const foundGenre3 = await service.findOne('3');

      expect(foundGenre1.data.name).toBe('Action');
      expect(foundGenre2.data.name).toBe('Comedy');
      expect(foundGenre3.data.name).toBe('Drama');
    });

    it('should handle mixed operations correctly', async () => {
      // Create genres
      await service.create({ name: 'Action' });
      await service.create({ name: 'Comedy' });
      await service.create({ name: 'Drama' });

      // Update one
      await service.update('2', { name: 'Romantic Comedy' });

      // Delete one
      await service.remove('3');

      // Verify final state
      const allGenres = await service.findAll();
      expect(allGenres.data).toHaveLength(2);

      // Find genres by their updated names (sorted alphabetically)
      const actionGenre = allGenres.data.find(g => g.name === 'Action');
      const comedyGenre = allGenres.data.find(g => g.name === 'Romantic Comedy');

      expect(actionGenre).toBeDefined();
      expect(comedyGenre).toBeDefined();

      // Verify deleted genre is gone
      await expect(service.findOne('3')).rejects.toThrow(NotFoundException);
    });
  });

  describe('Edge Cases', () => {
    it('should handle pagination edge cases', async () => {
      // Test page beyond available data
      const result = await service.findAll({ limit: 10, page: 999 });
      expect(result.data).toHaveLength(0);
      expect(result.currentPage).toBe(999);
      expect(result.isLastPage).toBe(true);
    });

    it('should handle very large pagination limits', async () => {
      await service.create(mockCreateGenreDto);

      const result = await service.findAll({ limit: 1000, page: 1 });
      expect(result.data).toHaveLength(1);
      expect(result.totalPages).toBe(1);
      expect(result.isLastPage).toBe(true);
    });

    it('should handle genres with similar names correctly', async () => {
      await service.create({ name: 'Action' });
      await service.create({ name: 'Action-Adventure' });
      await service.create({ name: 'Live Action' });

      const allGenres = await service.findAll();
      expect(allGenres.data).toHaveLength(3);

      // Should be sorted alphabetically
      expect(allGenres.data[0].name).toBe('Action');
      expect(allGenres.data[1].name).toBe('Action-Adventure');
      expect(allGenres.data[2].name).toBe('Live Action');
    });

    it('should handle special characters in genre names', async () => {
      const specialGenres = [
        { name: 'Sci-Fi' },
        { name: 'Action/Adventure' },
        { name: 'Horror & Thriller' },
        { name: 'Comedy (Stand-up)' },
      ];

      for (const genre of specialGenres) {
        const result = await service.create(genre);
        expect(result.data.name).toBe(genre.name);
      }

      const allGenres = await service.findAll();
      expect(allGenres.data).toHaveLength(4);
    });

    it('should handle whitespace in genre names correctly', async () => {
      const genreWithSpaces = { name: '  Action  ' };
      const result = await service.create(genreWithSpaces);

      // Should store the name as provided (with spaces)
      expect(result.data.name).toBe('  Action  ');

      const foundGenre = await service.findOne(result.data.id);
      expect(foundGenre.data.name).toBe('  Action  ');
    });
  });

  describe('Repository Integration', () => {
    it('should correctly use repository methods', async () => {
      const genreData = { name: 'Test Genre' };

      // Test create
      const created = await service.create(genreData);
      const repoGenre = await repository.findById(created.data.id);
      expect(repoGenre).toEqual(created.data);

      // Test findByName
      const foundByName = await repository.findByName(genreData.name);
      expect(foundByName).toEqual(created.data);

      // Test update
      const updateData = { name: 'Updated Genre' };
      await service.update(created.data.id, updateData);
      const updatedInRepo = await repository.findById(created.data.id);
      expect(updatedInRepo!.name).toBe(updateData.name);

      // Test delete
      await service.remove(created.data.id);
      const deletedFromRepo = await repository.findById(created.data.id);
      expect(deletedFromRepo).toBeNull();
    });
  });
});
