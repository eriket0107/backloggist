import { FastifyInstance } from "fastify";
import { Logger } from "../utils/logger";

export const registerLogger = (app: FastifyInstance) => {
  const logger = new Logger(app);

  app.decorate('logger', logger.createEntityLogger.bind(logger));
};