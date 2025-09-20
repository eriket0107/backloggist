import { ZodError } from "zod";
import { env } from "env";
import type { FastifyError, FastifyReply, FastifyRequest, FastifyInstance } from "fastify";
import { logger } from "../utils/logger";

export const registerErrorHandler = (app: FastifyInstance) => {
  const errorLogger = logger("errorHandler", app);

  const errorHandler = (
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    if (error instanceof ZodError) {
      errorLogger.warn("Validation error occurred");
      return reply.status(400).send({
        message: "Validation error",
        issues: error.format(),
      });
    }

    errorLogger.error(`Error: ${error.message} - ${request.method} ${request.url}`);

    if (env.NODE_ENV !== "prod") {
      console.error(error);
      errorLogger.error((error as Error)!.message);
    }

    return reply.status(500).send({ message: "Internal server error" });
  };

  app.setErrorHandler(errorHandler);
};
