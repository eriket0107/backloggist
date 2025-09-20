import { FastifyRequest, FastifyReply } from 'fastify';
import { RemoveGenreFromItemUseCase, RemoveGenreFromItemRequest } from '@/useCases/items/removeGenre/index.js';

interface RemoveGenreFromItemParams {
  itemId: string;
  genreId: string;
}

export class RemoveGenreFromItemController {
  constructor(private removeGenreFromItemUseCase: RemoveGenreFromItemUseCase) { }

  async handle(request: FastifyRequest<{ Params: RemoveGenreFromItemParams }>, reply: FastifyReply) {
    try {
      // TODO: Add request validation
      // TODO: Add authentication/authorization

      const removeGenreRequest: RemoveGenreFromItemRequest = {
        itemId: request.params.itemId,
        genreId: request.params.genreId,
      };

      const result = await this.removeGenreFromItemUseCase.execute(removeGenreRequest);

      return reply.status(200).send({
        success: result.success,
        message: 'Genre removed from item successfully',
      });
    } catch (error) {
      console.error(error);
      // TODO: Add proper error handling
      return reply.status(500).send({
        success: false,
        error: 'Internal server error',
      });
    }
  }
}
