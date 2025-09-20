import { FastifyRequest, FastifyReply } from 'fastify';
import { GetItemWithGenresUseCase, GetItemWithGenresRequest } from '@/useCases/items/getWithGenres/index.js';

interface GetItemWithGenresParams {
  id: string;
}

export class GetItemWithGenresController {
  constructor(private getItemWithGenresUseCase: GetItemWithGenresUseCase) { }

  async handle(request: FastifyRequest<{ Params: GetItemWithGenresParams }>, reply: FastifyReply) {
    try {
      // TODO: Add request validation
      // TODO: Add authentication/authorization if needed

      const getItemRequest: GetItemWithGenresRequest = {
        itemId: request.params.id,
      };

      const result = await this.getItemWithGenresUseCase.execute(getItemRequest);

      if (!result.item) {
        return reply.status(404).send({
          success: false,
          error: 'Item not found',
        });
      }

      return reply.status(200).send({
        success: true,
        data: result.item,
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
