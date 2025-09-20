import { Item, ItemType } from '@/types/index.js';
import { ItemsRepository } from '@/repositories/items.repository.js';

export interface UpdateItemRequest {
  id: string;
  title?: string;
  type?: ItemType;
  note?: string;
  imgUrl?: string;
}

export interface UpdateItemResponse {
  item: Item;
}

export class UpdateItemUseCase {
  constructor(private itemsRepository: ItemsRepository) { }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(request: UpdateItemRequest): Promise<UpdateItemResponse> {
    // TODO: Add business logic here
    // - Validate item exists
    // - Validate updates
    // - Update item

    throw new Error('Not implemented');
  }
}