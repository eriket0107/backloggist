import { FastifyRequest, FastifyReply } from 'fastify';
import { UpdateUserItemStatusUseCase, UpdateUserItemStatusRequest } from '@/useCases/userItems/updateStatus/index.js';
import { UserItemStatus } from '@/types/index.js';

interface UpdateStatusParams {
  userId: string;
  itemId: string;
}

interface UpdateStatusBody {
  status: UserItemStatus;
}

export class UpdateUserItemStatusController {
  constructor(private updateUserItemStatusUseCase: UpdateUserItemStatusUseCase) { }

  async handle(request: FastifyRequest<{ Params: UpdateStatusParams; Body: UpdateStatusBody }>, reply: FastifyReply) {
    try {
      // TODO: Add request validation
      // TODO: Add authentication/authorization
      // TODO: Get userId from JWT token instead of params

      const updateStatusRequest: UpdateUserItemStatusRequest = {
        userId: request.params.userId,
        itemId: request.params.itemId,
        status: request.body.status,
      };

      const result = await this.updateUserItemStatusUseCase.execute(updateStatusRequest);

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
