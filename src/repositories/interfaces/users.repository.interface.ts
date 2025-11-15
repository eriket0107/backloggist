import { User } from '@/types/entities';
import { Role } from '@/types/roles';


export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  roles?: Role[]
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
