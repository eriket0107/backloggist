import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateUserUseCase, CreateUserRequest } from '@/useCases/users/create/index.js';

interface CreateUserBody {
  email: string;
  password: string;
  name: string;
}

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) { }

  async handle(request: FastifyRequest<{ Body: CreateUserBody }>, reply: FastifyReply) {
    try {
      // TODO: Add request validation
      // TODO: Add authentication/authorization if needed

      const createUserRequest: CreateUserRequest = {
        email: request.body.email,
        password: request.body.password,
        name: request.body.name,
      };

      const result = await this.createUserUseCase.execute(createUserRequest);

      return reply.status(201).send({
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
