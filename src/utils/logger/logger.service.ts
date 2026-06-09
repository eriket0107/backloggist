import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerService {
  private writeLog(entity: string, level: string, message: string) {
    const logFile = path.join('logs', `${entity}.txt`);
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
      info: (message: string, metadata?: unknown) => {
        const fullMessage = metadata ? `${message} ${JSON.stringify(metadata)}` : message;
        this.writeLog(entity, 'info', fullMessage);
        console.log(`[${entity}] ${fullMessage}`);
      },
      warn: (message: string, metadata?: unknown) => {
        const fullMessage = metadata ? `${message} ${JSON.stringify(metadata)}` : message;
        this.writeLog(entity, 'warn', fullMessage);
        console.warn(`[${entity}] ${fullMessage}`);
      },
      error: (message: string) => {
        this.writeLog(entity, 'error', message);
        console.error(`[${entity}] ${message}`);
      },
      debug: (message: string, metadata?: unknown) => {
        const fullMessage = metadata ? `${message} ${JSON.stringify(metadata)}` : message;
        this.writeLog(entity, 'debug', fullMessage);
        console.debug(`[${entity}] ${fullMessage}`);
      },
      fatal: (message: string) => {
        this.writeLog(entity, 'fatal', message);
        console.error(`[${entity}] FATAL: ${message}`);
      },
    };
  }
}
