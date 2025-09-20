import { Logger } from '@/types/index.js';
import { ItemsRepository } from '@/repositories/items.repository.js';

export interface DeleteItemRequest {
  id: string;
}

export interface DeleteItemResponse {
  success: boolean;
}

export class DeleteItemUseCase {
  constructor(
    private itemsRepository: ItemsRepository,
    private logger: Logger
  ) { }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(request: DeleteItemRequest): Promise<DeleteItemResponse> {
    // TODO: Add business logic here
    // - Validate item exists
    // - Check dependencies (userItems, genres)
    // - Delete item

    throw new Error('Not implemented');
  }
}