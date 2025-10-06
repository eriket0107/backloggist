import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { LoggerService } from '@/utils/logger/logger.service';
import { IItemsRepository } from '@/repositories/interfaces/items.repository.interface';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { createReadStream, existsSync, ReadStream, unlink } from 'fs';
import * as path from 'path';
import { mkdir } from 'fs/promises';
import { Worker } from 'worker_threads';

@Injectable()
export class ItemsService {
  private logger;

  constructor(
    @Inject('IItemsRepository')
    private readonly itemsRepository: IItemsRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.logger = this.loggerService.createEntityLogger('ItemsService');
  }

  async create(createItemDto: CreateItemDto) {
    this.logger.info('Creating new item');

    const data = await this.itemsRepository.create(createItemDto);

    this.logger.info(`Item created with ID: ${data.id}`);
    return { data };
  }

  async findAll({ limit = 10, page = 1 }: { limit?: number, page?: number } = {}) {
    this.logger.info('Fetching all items');
    const data = await this.itemsRepository.findAll({ limit, page });

    this.logger.info(`Found ${data.totalItems} items`);

    return {
      ...data
    };
  }

  async findOne(id: string) {
    this.logger.info(`Fetching item with ID: ${id}`);

    const data = await this.itemsRepository.findById(id);

    if (!data) {
      this.logger.warn(`Item with ID ${id} not found`);
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    this.logger.info(`Item found: ${data.title}`);
    return { data };
  }

  async update(id: string, updateItemDto: UpdateItemDto) {
    this.logger.info(`Updating item with ID: ${id}`);

    const data = await this.itemsRepository.update(id, {
      ...updateItemDto,
      updatedAt: new Date()
    });

    if (!data) {
      this.logger.warn(`Item with ID ${id} not found for update`);
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    this.logger.info(`Item updated: ${data.title}`);
    return { data };
  }

  async remove(id: string) {
    this.logger.info(`Deleting item with ID: ${id}`);

    const data = await this.itemsRepository.delete(id);

    if (!data) {
      this.logger.warn(`Item with ID ${id} not found for deletion`);
      return { data: null };
    }

    this.logger.info(`Item deleted: ${data.title}`);
    return { data };
  }

  async saveImg(id: string, file: Express.Multer.File) {
    this.logger.info(`Starting file upload for item ID: ${id}`);


    this.validateFile(file)

    const pathUpload = path.join(process.cwd(), 'uploads');

    if (!existsSync(pathUpload)) {
      this.logger.info('Creating uploads directory');
      await mkdir(pathUpload, {
        recursive: true
      });
    }

    const fileName = `${id}.webp`;
    const filePath = path.join(pathUpload, fileName);

    if (existsSync(filePath)) {
      this.logger.info(`Deleting existing file: ${fileName}`);
      unlink(filePath, (err) => {
        if (err) {
          this.logger.error(`Failed to delete old file: ${err.message}`);
          throw new Error((err as Error).message);
        }
        this.logger.info('Old file deleted successfully');
      });
    }



    return new Promise((resolve, reject) => {
      this.logger.info(`Starting image processing with worker for item: ${id}`);

      const worker = new Worker(path.join(process.cwd(), 'src/workers/image-processor.js'), {
        workerData: {
          fileBuffer: file.buffer,
          filePath,
          quality: 80
        }
      });

      worker.on('message', async ({ success, filePath, error }) => {
        if (success) {
          this.logger.info(`Image processed successfully for item: ${id}`);
          try {
            await this.itemsRepository.update(id, {
              imgUrl: filePath
            });
            this.logger.info(`Database updated with image URL for item: ${id}`);
            resolve({ fileName, filePath });
          } catch (dbError) {
            this.logger.error(`Failed to update database for item ${id}: ${dbError.message}`);
            reject(dbError);
          }
        } else {
          this.logger.error(`Image processing failed for item ${id}: ${error}`);
          reject(new Error(error));
        }
        worker.terminate();
      });

      worker.on('error', (workerError) => {
        this.logger.error(`Worker error for item ${id}: ${workerError.message}`);
        reject(workerError);
      });
    });
  }

  async findImg(id: string): Promise<{ stream: ReadStream, fileName: string, filePath: string, contentType: string }> {
    const fileName = `${id}.webp`;
    const filePath = path.join(process.cwd(), 'uploads', fileName);

    if (!existsSync(filePath)) {
      this.logger.error(`Image not found: ${filePath}`);
      throw new NotFoundException('Image not found');
    }

    return new Promise((resolve, reject) => {
      const readStream = createReadStream(filePath);

      readStream.on('open', () => {
        this.logger.info(`Serving file: ${fileName}`);
        resolve({
          stream: readStream,
          fileName,
          filePath,
          contentType: 'image/webp',
        });
      });

      readStream.on('error', (error) => {
        this.logger.error(`Error reading file ${fileName}: ${error.message}`);
        reject(error);
      });
    });
  }


  private validateFile(file: Express.Multer.File): void {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const minSize = 1024; // 1KB

    if (!file) {
      this.logger.warn('No file provided');
      throw new ConflictException('No file provided');
    }

    if (!file.buffer || file.buffer.length === 0) {
      this.logger.warn('Empty file buffer received');
      throw new ConflictException('Empty file received');
    }

    if (file.size < minSize) {
      this.logger.warn(`File too small: ${file.size} bytes. Min required: ${minSize} bytes`);
      throw new ConflictException('File too small. Minimum size required is 1KB');
    }

    if (file.size > maxSize) {
      this.logger.warn(`File too large: ${file.size} bytes. Max allowed: ${maxSize} bytes`);
      throw new ConflictException('File too large. Maximum size allowed is 5MB');
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      this.logger.warn(`Invalid file format: ${file.mimetype}. Allowed: ${allowedMimeTypes.join(', ')}`);
      throw new ConflictException(`Invalid file format. Allowed formats: ${allowedMimeTypes.join(', ')}`);
    }

    if (!file.originalname || file.originalname.trim() === '') {
      this.logger.warn('No original filename provided');
      throw new ConflictException('Invalid filename');
    }

    this.logger.info(`File validation passed: ${file.originalname} (${file.mimetype}, ${file.size} bytes)`);
  }
}