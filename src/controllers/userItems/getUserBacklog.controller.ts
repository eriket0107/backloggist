import { FastifyRequest, FastifyReply } from 'fastify';
import { GetUserBacklogUseCase, GetUserBacklogRequest } from '@/useCases/userItems/getUserBacklog/index.js';
import { UserItemStatus } from '@/types/index.js';

interface GetUserBacklogParams {
  userId: string;
}

interface GetUserBacklogQuery {
  status?: UserItemStatus;
}

export class GetUserBacklogController {
  constructor(private getUserBacklogUseCase: GetUserBacklogUseCase) { }

  async handle(request: FastifyRequest<{ Params: GetUserBacklogParams; Querystring: GetUserBacklogQuery }>, reply: FastifyReply) {
    try {
      // TODO: Add request validation
      // TODO: Add authentication/authorization
      // TODO: Get userId from JWT token instead of params

      const getUserBacklogRequest: GetUserBacklogRequest = {
        userId: request.params.userId,
        status: request.query.status,
      };

      const result = await this.getUserBacklogUseCase.execute(getUserBacklogRequest);

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
