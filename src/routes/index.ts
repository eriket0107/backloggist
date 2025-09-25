import { FastifyInstance } from "fastify";
import { registerUserRoutes } from "./users.routes.js";

export const registerRoutes = (app: FastifyInstance) => {
  console.log('Routes has started.');

  registerUserRoutes(app);
}; 