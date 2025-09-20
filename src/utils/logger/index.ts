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
    const logEntry = `${timestamp} [${level.toUpperCase()}] [${entity}] ${message}\n`;

    fs.appendFileSync(logFile, logEntry);
  }

  info(entity: string, message: string) {
    this.writeLog(entity, 'info', message);
    this.fastify.log.info(`[${entity}] ${message}`);
  }

  warn(entity: string, message: string) {
    this.writeLog(entity, 'warn', message);
    this.fastify.log.warn(`[${entity}] ${message}`);
  }

  error(entity: string, message: string) {
    this.writeLog(entity, 'error', message);
    this.fastify.log.error(`[${entity}] ${message}`);
  }

  debug(entity: string, message: string) {
    this.writeLog(entity, 'debug', message);
    this.fastify.log.debug(`[${entity}] ${message}`);
  }

  fatal(entity: string, message: string) {
    this.writeLog(entity, 'fatal', message);
    this.fastify.log.fatal(`[${entity}] ${message}`);
  }
}

export const logger = (entity: string, fastify: FastifyInstance) => {
  const loggerInstance = new Logger(fastify);
  return {
    info: (message: string) => loggerInstance.info(entity, message),
    warn: (message: string) => loggerInstance.warn(entity, message),
    error: (message: string) => loggerInstance.error(entity, message),
    debug: (message: string) => loggerInstance.debug(entity, message),
    fatal: (message: string) => loggerInstance.fatal(entity, message),
  };
};