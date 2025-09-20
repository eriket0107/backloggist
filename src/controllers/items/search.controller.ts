import { FastifyRequest, FastifyReply } from 'fastify';
import { SearchItemsUseCase, SearchItemsRequest } from '@/useCases/items/search/index.js';
import { ItemType } from '@/types/index.js';

interface SearchItemsQuery {
  query?: string;
  type?: ItemType;
  title?: string;
}

export class SearchItemsController {
  constructor(private searchItemsUseCase: SearchItemsUseCase) { }

  async handle(request: FastifyRequest<{ Querystring: SearchItemsQuery }>, reply: FastifyReply) {
    try {
      // TODO: Add request validation
      // TODO: Add authentication/authorization if needed

      const searchItemsRequest: SearchItemsRequest = {
        query: request.query.query,
        type: request.query.type,
        title: request.query.title,
      };

      const result = await this.searchItemsUseCase.execute(searchItemsRequest);

      return reply.status(200).send({
        success: true,
        data: result.items,
      });
    } catch (error) {
      // TODO: Add proper error handling
      return reply.status(500).send({
        success: false,
        error: 'Internal server error',
      });
    }
  }
}
