import { env } from "env";
import fs from "node:fs";

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
  const logsDir = `${__dirname}/logs`;

  // Ensure logs directory exists first
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  if (!fs.existsSync(`${logsDir}/index.txt`)) {
    fs.writeFileSync(`${logsDir}/index.txt`, "");
  } else {
    const files = fs.readdirSync(logsDir)
      .filter(file => file !== 'index.txt' && file.endsWith('.txt'))
    fs.writeFileSync(`${logsDir}/index.txt`, files.join('\n').replaceAll('.txt', ''))
  }
}

export const registerFileSystem = () => {
  console.log("Initializing filesystem...");
  ensureDirectoriesExist();
  ensureDatabaseExists();
  ensureLogIndex()
  console.log("Filesystem initialization complete");
};
