import fs from "fs";
import path from "path";
import { FastifyInstance } from "fastify";

export class Logger {
  private fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  private writeLog(entity: string, level: string, message: string) {
    const logFile = path.join("logs", `${entity}.txt`);
    const logDir = path.dirname(logFile);

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const timestamp = new Date().toISOString();
    const logEntry = `[${entity}] | [${level.toUpperCase()}] | ${timestamp} | ${message}\n`;

    fs.appendFileSync(logFile, logEntry);
  }

  createEntityLogger(entity: string) {
    return {
      info: (message: string) => {
        this.writeLog(entity, 'info', message);
        this.fastify.log.info(`[${entity}] ${message}`);
      },
      warn: (message: string) => {
        this.writeLog(entity, 'warn', message);
        this.fastify.log.warn(`[${entity}] ${message}`);
      },
      error: (message: string) => {
        this.writeLog(entity, 'error', message);
        this.fastify.log.error(`[${entity}] ${message}`);
      },
      debug: (message: string) => {
        this.writeLog(entity, 'debug', message);
        this.fastify.log.debug(`[${entity}] ${message}`);
      },
      fatal: (message: string) => {
        this.writeLog(entity, 'fatal', message);
        this.fastify.log.fatal(`[${entity}] ${message}`);
      },
    };
  }
}

declare module "fastify" {
  interface FastifyInstance {
    logger: (entity: string) => {
      info: (message: string) => void;
      warn: (message: string) => void;
      error: (message: string) => void;
      debug: (message: string) => void;
      fatal: (message: string) => void;
    };
  }
}