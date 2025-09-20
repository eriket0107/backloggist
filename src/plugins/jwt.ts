import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { env } from "env";
import type { FastifyInstance } from "fastify";

export const registerAuth = (app: FastifyInstance) => {
  app.register(fastifyCookie);

  app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: "refreshToken",
      signed: false,
    },
    sign: {
      expiresIn: "10m",
    },
  });
};
