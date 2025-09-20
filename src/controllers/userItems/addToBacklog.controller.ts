import { FastifyRequest, FastifyReply } from 'fastify';
import { AddItemToBacklogUseCase, AddItemToBacklogRequest } from '@/useCases/userItems/addToBacklog/index.js';

interface AddToBacklogBody {
  userId: string;
  itemId: string;
  order?: number;
}

export class AddToBacklogController {
  constructor(private addItemToBacklogUseCase: AddItemToBacklogUseCase) { }

  async handle(request: FastifyRequest<{ Body: AddToBacklogBody }>, reply: FastifyReply) {
    try {
      // TODO: Add request validation
      // TODO: Add authentication/authorization
      // TODO: Get userId from JWT token instead of body

      const addToBacklogRequest: AddItemToBacklogRequest = {
        userId: request.body.userId,
        itemId: request.body.itemId,
        order: request.body.order,
      };

      const result = await this.addItemToBacklogUseCase.execute(addToBacklogRequest);

      return reply.status(201).send({
        success: true,
        data: result.userItem,
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
