import "dotenv/config";

import z from "zod";

const generateDatabaseUrl = () => {
  return `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;
};



const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "prod", "test"]).default("dev"),
  JWT_SECRET: z.string().optional().default("devTest"),
  PORT: z.coerce.number().default(3333),
  HOST: z.string().default("localhost"),
  DATABASE_URL: z.string().default(() => generateDatabaseUrl()),
  POSTGRES_HOST: z.string().default("localhost"),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_PORT: z.coerce.number().optional().default(5432),
  UPLOADS_DIR: z.string().default('src/uploads'),
  LOGS_DIR: z.string().default('logs'),
  LOG_USERNAME: z.string().default('admin'),
  LOG_PASSWORD: z.string().default('admin@123$')
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("❌ Invalid envoriment variables", _env.error.message);
  throw new Error("Invalid envoriment variables");
}

export const env = _env.data;