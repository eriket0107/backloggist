import { FastifyRequest, FastifyReply } from 'fastify';
import { UpdateUserUseCase, UpdateUserRequest } from '@/useCases/users/update/index.js';

interface UpdateUserParams {
  id: string;
}

interface UpdateUserBody {
  email?: string;
  password?: string;
  name?: string;
}

export class UpdateUserController {
  constructor(private updateUserUseCase: UpdateUserUseCase) { }

  async handle(request: FastifyRequest<{ Params: UpdateUserParams; Body: UpdateUserBody }>, reply: FastifyReply) {
    try {
      // TODO: Add request validation
      // TODO: Add authentication/authorization

      const updateUserRequest: UpdateUserRequest = {
        id: request.params.id,
        ...request.body,
      };

      const result = await this.updateUserUseCase.execute(updateUserRequest);

      return reply.status(200).send({
        success: true,
        data: result.user,
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
