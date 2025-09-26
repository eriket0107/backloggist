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
      info: (message: string) => {
        this.writeLog(entity, 'info', message);
        console.log(`[${entity}] ${message}`);
      },
      warn: (message: string) => {
        this.writeLog(entity, 'warn', message);
        console.warn(`[${entity}] ${message}`);
      },
      error: (message: string) => {
        this.writeLog(entity, 'error', message);
        console.error(`[${entity}] ${message}`);
      },
      debug: (message: string) => {
        this.writeLog(entity, 'debug', message);
        console.debug(`[${entity}] ${message}`);
      },
      fatal: (message: string) => {
        this.writeLog(entity, 'fatal', message);
        console.error(`[${entity}] FATAL: ${message}`);
      },
    };
  }
}