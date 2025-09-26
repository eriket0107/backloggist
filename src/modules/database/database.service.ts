import { Injectable, OnModuleInit } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';
import * as schema from '../../../db/schema';

@Injectable()
export class DatabaseService implements OnModuleInit {
  public db!: ReturnType<typeof drizzle>;

  async onModuleInit() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    const client = postgres(connectionString);
    this.db = drizzle(client, { schema });
  }
}
