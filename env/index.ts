import "dotenv/config";

import z from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "prod", "test"]).default("dev"),
  JWT_SECRET: z.string().optional().default("devTest"),
  PORT: z.coerce.number().default(3333),
  HOST: z.string().default("localhost"),
  DB_FILE_NAME: z.string().default(`db/index.db`),
  UPLOADS_DIR: z.string().default('src/uploads'),
  LOGS_DIR: z.string().default('logs'),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("❌ Invalid envoriment variables", _env.error.message);
  console.log(process.env.JWT_SECRET);
  throw new Error("Invalid envoriment variables");
}

export const env = _env.data;