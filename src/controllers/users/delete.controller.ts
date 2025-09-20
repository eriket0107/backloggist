import { FastifyRequest, FastifyReply } from 'fastify';
import { DeleteUserUseCase, DeleteUserRequest } from '@/useCases/users/delete/index.js';

interface DeleteUserParams {
  id: string;
}

export class DeleteUserController {
  constructor(private deleteUserUseCase: DeleteUserUseCase) { }

  async handle(request: FastifyRequest<{ Params: DeleteUserParams }>, reply: FastifyReply) {
    try {
      // TODO: Add request validation
      // TODO: Add authentication/authorization

      const deleteUserRequest: DeleteUserRequest = {
        id: request.params.id,
      };

      const result = await this.deleteUserUseCase.execute(deleteUserRequest);

      return reply.status(200).send({
        success: result.success,
        message: 'User deleted successfully',
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
