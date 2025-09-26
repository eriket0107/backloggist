import { User } from '@/types/entities';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  updatedAt?: Date;
}

export interface IUsersRepository {
  create(userData: CreateUserData): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, userData: UpdateUserData): Promise<User | null>;
  delete(id: string): Promise<User | null>;
}
