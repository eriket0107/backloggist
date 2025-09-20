import type { FastifyInstance } from "fastify";
import { registerCors } from "./cors";
import { registerAuth } from "./jwt";
import { registerFiles } from "./files";
import { registerSwagger } from "./swagger";
import { registerErrorHandler } from "./error";
import { registerFileSystem } from "./filesystem";
import { registerRoutes } from "@/routes";

export const registerAllPlugins = (app: FastifyInstance) => {
  registerFileSystem(app);
  registerCors(app);
  registerAuth(app);
  registerFiles(app);
  registerSwagger(app);
  registerErrorHandler(app);
  registerRoutes(app);
};
