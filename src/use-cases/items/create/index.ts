import { Item, ItemType } from '@/types/index.js';
import { ItemsRepository } from '@/repositories/items.repository.js';

export interface CreateItemRequest {
  id: string;
  title: string;
  type: ItemType;
  note?: string;
  imgUrl?: string;
}

export interface CreateItemResponse {
  item: Item;
}

export class CreateItemUseCase {
  constructor(private itemsRepository: ItemsRepository) { }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_request: CreateItemRequest): Promise<CreateItemResponse> {
    // TODO: Add business logic here
    // - Validate required fields
    // - Check for duplicates
    // - Create item

    throw new Error('Not implemented');
  }
}
