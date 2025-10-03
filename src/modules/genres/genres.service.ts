import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { LoggerService } from '@/utils/logger/logger.service';
import { IGenresRepository } from '@/repositories/interfaces/genres.repository.interface';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  private logger;

  constructor(
    @Inject('IGenresRepository')
    private readonly genresRepository: IGenresRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.logger = this.loggerService.createEntityLogger('GenresService');
  }

  async create(createGenreDto: CreateGenreDto) {
    this.logger.info('Creating new genre');

    const existingGenre = await this.genresRepository.findByName(createGenreDto.name);
    if (existingGenre) {
      this.logger.warn(`Genre with name '${createGenreDto.name}' already exists`);
      throw new ConflictException(`Genre with name '${createGenreDto.name}' already exists`);
    }

    const data = await this.genresRepository.create(createGenreDto);

    this.logger.info(`Genre created with ID: ${data.id}`);
    return { data };
  }

  async findAll({ limit = 10, page = 1, search }: { limit?: number, page?: number, search?: string } = {}) {
    this.logger.info('Fetching all genres');

    const data = await this.genresRepository.findAll({ limit, page, search: search ? search : undefined });

    this.logger.info(`Found ${data.totalItems} genres`);

    return {
      ...data
    };
  }

  async findOne(id: string) {
    this.logger.info(`Fetching genre with ID: ${id}`);

    const data = await this.genresRepository.findById(id);

    if (!data) {
      this.logger.warn(`Genre with ID ${id} not found`);
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }

    this.logger.info(`Genre found: ${data.name}`);
    return { data };
  }

  async update(id: string, updateGenreDto: UpdateGenreDto) {
    this.logger.info(`Updating genre with ID: ${id}`);

    if (updateGenreDto.name) {
      const existingGenre = await this.genresRepository.findByName(updateGenreDto.name);
      if (existingGenre && existingGenre.id !== id) {
        this.logger.warn(`Genre with name '${updateGenreDto.name}' already exists`);
        throw new ConflictException(`Genre with name '${updateGenreDto.name}' already exists`);
      }
    }

    const data = await this.genresRepository.update(id, updateGenreDto);

    if (!data) {
      this.logger.warn(`Genre with ID ${id} not found for update`);
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }

    this.logger.info(`Genre updated: ${data.name}`);
    return { data };
  }

  async remove(id: string) {
    this.logger.info(`Deleting genre with ID: ${id}`);

    const data = await this.genresRepository.delete(id);

    if (!data) {
      this.logger.warn(`Genre with ID ${id} not found for deletion`);
      return { data: null };
    }

    this.logger.info(`Genre deleted: ${data.name}`);
    return { data };
  }
}
