import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify";

export const registerSwagger = (app: FastifyInstance) => {
  app.register(fastifySwagger, {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "Backloggist",
        description: "Backend for an Application of backlog",
        version: "1.0.0",
      },
    },
  });

  app
    .register(fastifySwaggerUI, {
      routePrefix: "/docs",
      uiConfig: {
        docExpansion: "none",
        deepLinking: false,
      },
      staticCSP: true,
    })
    .withTypeProvider();
};
