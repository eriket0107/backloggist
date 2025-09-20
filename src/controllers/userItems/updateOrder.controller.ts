import { FastifyRequest, FastifyReply } from 'fastify';
import { UpdateUserItemOrderUseCase, UpdateUserItemOrderRequest } from '@/useCases/userItems/updateOrder/index.js';

interface UpdateOrderParams {
  userId: string;
  itemId: string;
}

interface UpdateOrderBody {
  order: number;
}

export class UpdateUserItemOrderController {
  constructor(private updateUserItemOrderUseCase: UpdateUserItemOrderUseCase) { }

  async handle(request: FastifyRequest<{ Params: UpdateOrderParams; Body: UpdateOrderBody }>, reply: FastifyReply) {
    try {
      // TODO: Add request validation
      // TODO: Add authentication/authorization
      // TODO: Get userId from JWT token instead of params

      const updateOrderRequest: UpdateUserItemOrderRequest = {
        userId: request.params.userId,
        itemId: request.params.itemId,
        order: request.body.order,
      };

      const result = await this.updateUserItemOrderUseCase.execute(updateOrderRequest);

      return reply.status(200).send({
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
