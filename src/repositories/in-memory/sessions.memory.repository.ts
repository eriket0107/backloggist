import { Injectable } from '@nestjs/common';
import { ISessionsRepository, CreateSessionData, UpdateSessionData } from '@/repositories/interfaces/sessions.repository.interface';
import { Session } from '@/types/entities';

@Injectable()
export class SessionsMemoryRepository implements ISessionsRepository {
  private sessions: Session[] = [];
  private nextId = 1;

  async create(sessionData: CreateSessionData): Promise<Session> {
    const session: Session = {
      id: this.nextId.toString(),
      userId: sessionData.userId,
      accessToken: sessionData.accessToken,
      isExpired: sessionData.isExpired,
    };

    this.sessions.push(session);
    this.nextId++;
    return session;
  }

  async findById(id: string): Promise<Session | null> {
    return this.sessions.find(session => session.id === id) || null;
  }

  async findByUserId(userId: string): Promise<Session | null> {
    return this.sessions.find(session => session.userId === userId) || null;
  }

  async findByAccessToken(accessToken: string): Promise<Session | null> {
    return this.sessions.find(session => session.accessToken === accessToken) || null;
  }

  async update(id: string, accessToken: string, sessionData: UpdateSessionData): Promise<Session | null> {
    const sessionIndex = this.sessions.findIndex(session => session.id === id && session.accessToken === accessToken);
    if (sessionIndex === -1) {
      return null;
    }

    this.sessions[sessionIndex] = {
      ...this.sessions[sessionIndex],
      ...sessionData,
    };

    return this.sessions[sessionIndex];
  }

  async delete(id: string): Promise<Session | null> {
    const sessionIndex = this.sessions.findIndex(session => session.id === id);
    if (sessionIndex === -1) {
      return null;
    }

    const deletedSession = this.sessions[sessionIndex];
    this.sessions.splice(sessionIndex, 1);
    return deletedSession;
  }

  async deleteByUserId(userId: string): Promise<Session | null> {
    const sessionIndex = this.sessions.findIndex(session => session.userId === userId);
    if (sessionIndex === -1) {
      return null;
    }

    const deletedSession = this.sessions[sessionIndex];
    this.sessions.splice(sessionIndex, 1);
    return deletedSession;
  }
}
