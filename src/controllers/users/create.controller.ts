import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { CreateUserUseCase, CreateUserRequest } from '@/useCases/users/create/index.js';
import { error } from 'node:console';

const createUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) { }
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const validationResult = createUserBodySchema.safeParse(request.body);

      if (!validationResult.success) {
        return reply.status(400).send({
          success: false,
          error: 'Validation failed',
          details: validationResult.error.issues,
        });
      }

      const { email, password, name } = validationResult.data;

      const createUserRequest: CreateUserRequest = {
        user: {
          email,
          password,
          name,
        },
      };

      const result = await this.createUserUseCase.execute(createUserRequest);

      return reply.status(201).send({
        success: true,
        data: result.user,
      });
    } catch (error) {
      console.error(error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: (error as Error).message
      });
    }
    throw error
  }
}
