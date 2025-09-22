import { FastifyInstance } from "fastify";


export const registerRoutes = (app: FastifyInstance) => {
  const routesLogger = app.logger('routes');
  console.log('Routes has started.');


}; 