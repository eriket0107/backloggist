import { Logger } from '@/types/index.js';
import { ItemsRepository } from '@/repositories/items.repository.js';

export interface AddGenreToItemRequest {
  itemId: string;
  genreId: string;
}

export interface AddGenreToItemResponse {
  success: boolean;
}

export class AddGenreToItemUseCase {
  constructor(
    private itemsRepository: ItemsRepository,
    private logger: Logger
  ) { }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_request: AddGenreToItemRequest): Promise<AddGenreToItemResponse> {
    // TODO: Add business logic here
    // - Validate item exists
    // - Validate genre exists
    // - Check if genre already added
    // - Add genre to item

    throw new Error('Not implemented');
  }
}