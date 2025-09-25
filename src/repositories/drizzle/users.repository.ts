import { NewUser, User } from "@/types";
import { UsersRepository } from "../users.repository";
import { DrizzleRepository } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

class UsersDrizzleRepository implements UsersRepository {
  constructor(private repository: DrizzleRepository) { }

  async create(data: Omit<NewUser, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const [user] = await this.repository.insert(usersTable).values(data).returning();
    return user;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(usersTable).where(eq(usersTable.id, id))
  }

  async findAll(): Promise<User[]> {
    return await this.repository.select().from(usersTable)
  }

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await this.repository.select().from(usersTable).where(eq(usersTable.email, email))

    return user
  }

  async findById(id: string): Promise<User | null> {
    const [user] = await this.repository.select().from(usersTable).where(eq(usersTable.id, id))

    return user
  }

  async update(id: string, data: Partial<Omit<NewUser, "id">>): Promise<User | undefined> {
    const [user] = await this.repository.update(usersTable).set({
      ...data,
    }).where(eq(usersTable.id, id))

    return user
  }

}

export { UsersDrizzleRepository };