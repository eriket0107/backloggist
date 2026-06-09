
import { defineConfig, type Config } from 'drizzle-kit';
import { env } from './env';

export default defineConfig({
  out: './drizzle', 
  schema: './db/schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
}) satisfies Config;