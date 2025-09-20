import { FastifyRequest, FastifyReply } from 'fastify';
import { FindAllUsersUseCase, FindAllUsersRequest } from '@/useCases/users/findAll/index.js';

export class FindAllUsersController {
  constructor(private findAllUsersUseCase: FindAllUsersUseCase) { }

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      // TODO: Add authentication/authorization
      // TODO: Add pagination from query params

      const findAllUsersRequest: FindAllUsersRequest = {
        // Add pagination/filtering from query params
      };

      const result = await this.findAllUsersUseCase.execute(findAllUsersRequest);

      return reply.status(200).send({
        success: true,
        data: result.users,
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
