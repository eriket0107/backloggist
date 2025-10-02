import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/modules/database/database.service';
import { and, desc, eq } from 'drizzle-orm';
import { sessionsTable } from '../../../db/schema';
import { ISessionsRepository, CreateSessionData, UpdateSessionData } from '@/repositories/interfaces/sessions.repository.interface';

@Injectable()
export class SessionsRepository implements ISessionsRepository {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(sessionData: CreateSessionData) {
    const [session] = await this.databaseService.db
      .insert(sessionsTable)
      .values({
        ...sessionData,
        isExpired: false
      })
      .returning();
    return session;
  }
  async findByUserId(userId: string) {
    const [session] = await this.databaseService.db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.userId, userId))
      .orderBy(desc(sessionsTable.createdAt));

    return session || null;
  }

  async findByAccessToken(accessToken: string, isExpired?: boolean) {
    const [session] = await this.databaseService.db
      .select()
      .from(sessionsTable)
      .where(and(eq(sessionsTable.accessToken, accessToken), eq(sessionsTable.isExpired, isExpired ? isExpired : false)))

    return session;
  }

  async update(userId: string, accessToken: string, sessionData: UpdateSessionData) {
    const [session] = await this.databaseService.db
      .update(sessionsTable)
      .set(sessionData)
      .where(and(eq(sessionsTable.userId, userId), eq(sessionsTable.accessToken, accessToken)))
      .returning();
    return session || null;
  }

  async expireToken(accessToken: string) {
    await this.databaseService.db
      .update(sessionsTable)
      .set({
        isExpired: true
      })
      .where(eq(sessionsTable.accessToken, accessToken))
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
