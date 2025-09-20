import { FastifyRequest, FastifyReply } from 'fastify';
import { RemoveItemFromBacklogUseCase, RemoveItemFromBacklogRequest } from '@/useCases/userItems/removeFromBacklog/index.js';

interface RemoveFromBacklogParams {
  userId: string;
  itemId: string;
}

export class RemoveFromBacklogController {
  constructor(private removeItemFromBacklogUseCase: RemoveItemFromBacklogUseCase) { }

  async handle(request: FastifyRequest<{ Params: RemoveFromBacklogParams }>, reply: FastifyReply) {
    try {
      // TODO: Add request validation
      // TODO: Add authentication/authorization
      // TODO: Get userId from JWT token instead of params

      const removeFromBacklogRequest: RemoveItemFromBacklogRequest = {
        userId: request.params.userId,
        itemId: request.params.itemId,
      };

      const result = await this.removeItemFromBacklogUseCase.execute(removeFromBacklogRequest);

      return reply.status(200).send({
        success: result.success,
        message: 'Item removed from backlog successfully',
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
