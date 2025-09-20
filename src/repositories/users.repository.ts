import { User, NewUser } from "../types/index.js";

export interface UsersRepository {
  create(data: Omit<NewUser, 'createdAt' | 'updatedAt'>): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, data: Partial<Omit<NewUser, 'id'>>): Promise<User>;
  delete(id: string): Promise<void>;
  findAll(): Promise<User[]>;
}

