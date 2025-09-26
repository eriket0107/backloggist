import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/modules/database/database.service';
import { eq } from 'drizzle-orm';
import { usersTable } from '../../../db/schema';
import { IUsersRepository, CreateUserData, UpdateUserData } from '@/repositories/interfaces/users.repository.interface';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(userData: CreateUserData) {
    const [user] = await this.databaseService.db
      .insert(usersTable)
      .values(userData)
      .returning();
    return user;
  }

  async findAll() {
    return await this.databaseService.db
      .select()
      .from(usersTable);
  }

  async findById(id: string) {
    const [user] = await this.databaseService.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));
    return user || null;
  }

  async findByEmail(email: string) {
    const [user] = await this.databaseService.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    return user || null;
  }

  async update(id: string, userData: UpdateUserData) {
    const [user] = await this.databaseService.db
      .update(usersTable)
      .set(userData)
      .where(eq(usersTable.id, id))
      .returning();
    return user || null;
  }

  async delete(id: string) {
    const [user] = await this.databaseService.db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning();
    return user || null;
  }
}