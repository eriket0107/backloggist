import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '@/env';
import * as schema from './schema';

const client = postgres(env.DATABASE_URL);

export const db: PostgresJsDatabase<typeof schema> = drizzle(client, { schema });

export type DrizzleRepository = typeof db
