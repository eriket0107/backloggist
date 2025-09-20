import { FastifyRequest, FastifyReply } from 'fastify';
import { FindUserByIdUseCase, FindUserByIdRequest } from '@/useCases/users/findById/index.js';

interface FindUserByIdParams {
  id: string;
}

export class FindUserByIdController {
  constructor(private findUserByIdUseCase: FindUserByIdUseCase) { }

  async handle(request: FastifyRequest<{ Params: FindUserByIdParams }>, reply: FastifyReply) {
    try {
      // TODO: Add request validation
      // TODO: Add authentication/authorization

      const findUserRequest: FindUserByIdRequest = {
        id: request.params.id,
      };

      const result = await this.findUserByIdUseCase.execute(findUserRequest);

      if (!result.user) {
        return reply.status(404).send({
          success: false,
          error: 'User not found',
        });
      }

      return reply.status(200).send({
        success: true,
        data: result.user,
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
