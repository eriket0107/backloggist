import { Item, ItemType } from '@/types/index.js';
import { ItemsRepository } from '@/repositories/items.repository.js';

export interface SearchItemsRequest {
  query?: string;
  type?: ItemType;
  title?: string;
}

export interface SearchItemsResponse {
  items: Item[];
}

export class SearchItemsUseCase {
  constructor(private itemsRepository: ItemsRepository) { }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(request: SearchItemsRequest): Promise<SearchItemsResponse> {
    // TODO: Add business logic here
    // - Validate search parameters
    // - Apply search filters
    // - Return results

    throw new Error('Not implemented');
  }
}