import { FastifyRequest, FastifyReply } from 'fastify';
import { UpdateUserItemRatingUseCase, UpdateUserItemRatingRequest } from '@/useCases/userItems/updateRating/index.js';

interface UpdateRatingParams {
  userId: string;
  itemId: string;
}

interface UpdateRatingBody {
  rating: number;
}

export class UpdateUserItemRatingController {
  constructor(private updateUserItemRatingUseCase: UpdateUserItemRatingUseCase) { }

  async handle(request: FastifyRequest<{ Params: UpdateRatingParams; Body: UpdateRatingBody }>, reply: FastifyReply) {
    try {
      // TODO: Add request validation
      // TODO: Add authentication/authorization
      // TODO: Get userId from JWT token instead of params

      const updateRatingRequest: UpdateUserItemRatingRequest = {
        userId: request.params.userId,
        itemId: request.params.itemId,
        rating: request.body.rating,
      };

      const result = await this.updateUserItemRatingUseCase.execute(updateRatingRequest);

      return reply.status(200).send({
        success: true,
        data: result.userItem,
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
