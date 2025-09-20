import { ItemsRepository } from '@/repositories/items.repository.js';

export interface RemoveGenreFromItemRequest {
  itemId: string;
  genreId: string;
}

export interface RemoveGenreFromItemResponse {
  success: boolean;
}

export class RemoveGenreFromItemUseCase {
  constructor(private itemsRepository: ItemsRepository) { }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(request: RemoveGenreFromItemRequest): Promise<RemoveGenreFromItemResponse> {
    // TODO: Add business logic here
    // - Validate item exists
    // - Validate genre exists
    // - Check if genre is associated
    // - Remove genre from item

    throw new Error('Not implemented');
  }
}