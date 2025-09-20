import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import { env } from "env";
import path from "node:path";
import type { FastifyInstance } from "fastify";

const __dirname = process.cwd();

export const registerFiles = (app: FastifyInstance) => {
  app.register(fastifyMultipart, {
    limits: { fileSize: 1 * 1024 * 1024 }, // 1MB max file size
  });

  app.register(fastifyStatic, {
    root: path.join(__dirname, env.UPLOADS_DIR),
    prefix: "/uploads",
  });

  app.register(fastifyStatic, {
    root: path.join(__dirname, env.LOGS_DIR),
    prefix: "/logs",
    decorateReply: false,
  });
};
