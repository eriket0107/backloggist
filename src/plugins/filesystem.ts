import { env } from "env";
import fs from "node:fs";
import { logger } from "../utils/logger";
import { FastifyInstance } from "fastify";

const __dirname = process.cwd();

export const ensureDirectoriesExist = () => {
  if (!fs.existsSync(env.UPLOADS_DIR)) {
    fs.mkdirSync(`${__dirname}/${env.UPLOADS_DIR}`, { recursive: true });

  }
};

export const ensureDatabaseExists = () => {
  if (!fs.existsSync(`${__dirname}/${env.DB_FILE_NAME}`)) {
    fs.writeFileSync(`${__dirname}/${env.DB_FILE_NAME}`, "");
  }
};

export const ensureLogIndex = () => {
  if (!fs.existsSync(`${__dirname}/logs/index.txt`)) {
    fs.writeFileSync(`${__dirname}/logs/index.txt`, "");
  } else {
    const files = fs.readdirSync(`${__dirname}/logs`)
      .filter(file => file.endsWith('.txt'))
    fs.writeFileSync(`${__dirname}/logs/index.txt`, files.join('\n').replaceAll('.txt', ''))
  }
}

export const registerFileSystem = (app: FastifyInstance) => {
  const fsLogger = logger("filesystem", app);
  fsLogger.info("Initializing filesystem...");
  ensureDirectoriesExist();
  ensureDatabaseExists();
  ensureLogIndex()
  fsLogger.info("Filesystem initialization complete");
};
