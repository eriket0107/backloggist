import { User, NewUser } from "../../types/index.js";
import { UsersRepository } from "../users.repository.js";
import { randomUUID } from 'node:crypto';

export class UsersInMemoryRepository implements UsersRepository {
  private users: User[] = [];

  async create(data: Omit<NewUser, 'createdAt' | 'updatedAt'>): Promise<User> {
    const now = new Date();
    const user: User = {
      ...data,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    this.users.push(user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find(u => u.id === id);
    return user || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(u => u.email === email);
    return user || null;
  }

  async update(id: string, data: Partial<Omit<NewUser, 'id'>>): Promise<User> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error(`User with id ${id} not found`);
    }

    const updatedUser = {
      ...this.users[userIndex],
      ...data,
      updatedAt: new Date(),
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error(`User with id ${id} not found`);
    }

    this.users.splice(userIndex, 1);
  }

  async findAll(): Promise<User[]> {
    return [...this.users];
  }
}
