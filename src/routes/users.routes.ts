import { FastifyInstance } from 'fastify';
import { CreateUserController } from '@/controllers/users/create.controller.js';
import { CreateUserUseCase } from '@/useCases/users/create/index.js';
import { Logger } from '@/utils/logger';
import { UsersDrizzleRepository } from '@/repositories/drizzle';
import { db } from '@/db';

export const registerUserRoutes = (app: FastifyInstance) => {
  const logger = new Logger(app);
  const usersRepository = new UsersDrizzleRepository(db);
  const createUserUseCase = new CreateUserUseCase(usersRepository, logger);
  const createUserController = new CreateUserController(createUserUseCase);

  app.post('/users', async (request, reply) => {
    return createUserController.handle(request, reply);
  });
};
