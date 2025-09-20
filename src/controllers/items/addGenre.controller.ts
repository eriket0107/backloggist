import { FastifyRequest, FastifyReply } from 'fastify';
import { AddGenreToItemUseCase, AddGenreToItemRequest } from '@/useCases/items/addGenre/index.js';

interface AddGenreToItemParams {
  itemId: string;
  genreId: string;
}

export class AddGenreToItemController {
  constructor(private addGenreToItemUseCase: AddGenreToItemUseCase) { }

  async handle(request: FastifyRequest<{ Params: AddGenreToItemParams }>, reply: FastifyReply) {
    try {
      // TODO: Add request validation
      // TODO: Add authentication/authorization

      const addGenreRequest: AddGenreToItemRequest = {
        itemId: request.params.itemId,
        genreId: request.params.genreId,
      };

      const result = await this.addGenreToItemUseCase.execute(addGenreRequest);

      return reply.status(200).send({
        success: result.success,
        message: 'Genre added to item successfully',
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
