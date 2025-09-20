import { Item, Genre } from '@/types/index.js';
import { ItemsRepository } from '@/repositories/items.repository.js';

export interface GetItemWithGenresRequest {
  itemId: string;
}

export interface GetItemWithGenresResponse {
  item: (Item & { genres: Genre[] }) | null;
}

export class GetItemWithGenresUseCase {
  constructor(private itemsRepository: ItemsRepository) { }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(request: GetItemWithGenresRequest): Promise<GetItemWithGenresResponse> {
    // TODO: Add business logic here
    // - Validate item ID
    // - Get item with genres

    throw new Error('Not implemented');
  }
}