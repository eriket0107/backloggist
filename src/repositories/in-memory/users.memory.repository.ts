import { Injectable } from '@nestjs/common';
import { IUsersRepository, CreateUserData, UpdateUserData } from '@/repositories/interfaces/users.repository.interface';
import { User } from '@/types/entities';

@Injectable()
export class UsersMemoryRepository implements IUsersRepository {
  private users: User[] = [];
  private nextId = 1;

  async create(userData: CreateUserData): Promise<User> {
    const user: User = {
      id: this.nextId.toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(user);
    this.nextId++;

    return { ...user };
  }

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find(user => user.id === id);
    return user ? { ...user } : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(user => user.email === email);
    return user ? { ...user } : null;
  }

  async update(id: string, userData: UpdateUserData): Promise<User | null> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return null;
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...userData,
      updatedAt: new Date(),
    };

    return { ...this.users[userIndex] };
  }

  async delete(id: string): Promise<User | null> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return null;
    }

    const deletedUser = this.users[userIndex];
    this.users.splice(userIndex, 1);
    return { ...deletedUser };
  }
}
