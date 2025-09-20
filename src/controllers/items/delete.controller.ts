import { FastifyRequest, FastifyReply } from 'fastify';
import { DeleteItemUseCase, DeleteItemRequest } from '@/useCases/items/delete/index.js';

interface DeleteItemParams {
  id: string;
}

export class DeleteItemController {
  constructor(private deleteItemUseCase: DeleteItemUseCase) { }

  async handle(request: FastifyRequest<{ Params: DeleteItemParams }>, reply: FastifyReply) {
    try {
      // TODO: Add request validation
      // TODO: Add authentication/authorization

      const deleteItemRequest: DeleteItemRequest = {
        id: request.params.id,
      };

      const result = await this.deleteItemUseCase.execute(deleteItemRequest);

      return reply.status(200).send({
        success: result.success,
        message: 'Item deleted successfully',
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
