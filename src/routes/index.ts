import { logger } from "@/utils/logger";
import { FastifyInstance } from "fastify";


export const registerRoutes = (app: FastifyInstance) => {
  const routesLogger = logger('routes', app);
  routesLogger.info('Routes has started.');


};