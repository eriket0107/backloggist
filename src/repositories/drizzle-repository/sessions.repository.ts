import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/modules/database/database.service';
import { eq } from 'drizzle-orm';
import { sessionsTable } from '../../../db/schema';
import { ISessionsRepository, CreateSessionData, UpdateSessionData } from '@/repositories/interfaces/sessions.repository.interface';

@Injectable()
export class SessionsRepository implements ISessionsRepository {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(sessionData: CreateSessionData) {
    const [session] = await this.databaseService.db
      .insert(sessionsTable)
      .values(sessionData)
      .returning();
    return session;
  }

  async findById(id: string) {
    const [session] = await this.databaseService.db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.id, id));
    return session || null;
  }

  async findByUserId(userId: string) {
    const [session] = await this.databaseService.db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.userId, userId));
    return session || null;
  }

  async findByAccessToken(accessToken: string) {
    const [session] = await this.databaseService.db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.accessToken, accessToken));
    return session || null;
  }

  async update(id: string, sessionData: UpdateSessionData) {
    const [session] = await this.databaseService.db
      .update(sessionsTable)
      .set(sessionData)
      .where(eq(sessionsTable.id, id))
      .returning();
    return session || null;
  }

  async delete(id: string) {
    const [session] = await this.databaseService.db
      .delete(sessionsTable)
      .where(eq(sessionsTable.id, id))
      .returning();
    return session || null;
  }

  async deleteByUserId(userId: string) {
    const [session] = await this.databaseService.db
      .delete(sessionsTable)
      .where(eq(sessionsTable.userId, userId))
      .returning();
    return session || null;
  }
}
