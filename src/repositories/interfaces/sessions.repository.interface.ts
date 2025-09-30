import { Session } from '@/types/entities';

export interface CreateSessionData {
  userId: string;
  accessToken: string;
  isExpired?: boolean;
  expiredAt?: Date
}

export interface UpdateSessionData {
  accessToken?: string;
  isExpired?: boolean;
  expiredAt?: Date
}

export interface ISessionsRepository {
  create(sessionData: CreateSessionData): Promise<Session>;
  findByAccessToken(id: string): Promise<Session | null>;
  findByUserId(userId: string): Promise<Session | null>;
  update(userId: string, accessToken: string, sessionData: UpdateSessionData): Promise<Session | null>;
  delete(id: string): Promise<Session | null>;
  deleteByUserId(userId: string): Promise<Session | null>;
}
