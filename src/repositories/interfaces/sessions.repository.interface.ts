import { Session } from '@/types/entities';

export interface CreateSessionData {
  userId: string;
  accessToken: string;
  isExpired?: boolean;
}

export interface UpdateSessionData {
  accessToken?: string;
  isExpired?: boolean;
}

export interface ISessionsRepository {
  create(sessionData: CreateSessionData): Promise<Session>;
  findById(id: string): Promise<Session | null>;
  findByUserId(userId: string): Promise<Session | null>;
  update(id: string, sessionData: UpdateSessionData): Promise<Session | null>;
  delete(id: string): Promise<Session | null>;
  deleteByUserId(userId: string): Promise<Session | null>;
}
