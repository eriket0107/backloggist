import { FastifyRequest, FastifyReply } from 'fastify';
import { GetUserBacklogStatsUseCase, GetUserBacklogStatsRequest } from '@/useCases/userItems/getBacklogStats/index.js';

interface GetBacklogStatsParams {
  userId: string;
}

export class GetUserBacklogStatsController {
  constructor(private getUserBacklogStatsUseCase: GetUserBacklogStatsUseCase) { }

  async handle(request: FastifyRequest<{ Params: GetBacklogStatsParams }>, reply: FastifyReply) {
    try {
      // TODO: Add request validation
      // TODO: Add authentication/authorization
      // TODO: Get userId from JWT token instead of params

      const getBacklogStatsRequest: GetUserBacklogStatsRequest = {
        userId: request.params.userId,
      };

      const result = await this.getUserBacklogStatsUseCase.execute(getBacklogStatsRequest);

      return reply.status(200).send({
        success: true,
        data: result.stats,
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
