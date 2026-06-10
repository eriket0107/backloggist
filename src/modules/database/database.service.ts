import { Injectable, OnModuleInit } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/db/schema';
import { env } from '@/env';

@Injectable()
export class DatabaseService implements OnModuleInit {
  public db!: ReturnType<typeof drizzle>;

  async onModuleInit() {
    const connectionString = env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    const client = postgres(connectionString);
    this.db = drizzle(client, { schema });
  }
}
