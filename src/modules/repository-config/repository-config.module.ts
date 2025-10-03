import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@/modules/database/database.module';
import { UsersRepository } from '@/repositories/drizzle-repository/users.repository';
import { ItemsRepository } from '@/repositories/drizzle-repository/items.repository';
import { UserItemsRepository } from '@/repositories/drizzle-repository/user-items.repository';
import { SessionsRepository } from '@/repositories/drizzle-repository/sessions.repository';
import { GenresRepository } from '@/repositories/drizzle-repository/genres.repository';
import { ItemGenresRepository } from '@/repositories/drizzle-repository/item-genres.repository';
import { UsersMemoryRepository } from '@/repositories/in-memory/users.memory.repository';
import { ItemsMemoryRepository } from '@/repositories/in-memory/items.memory.repository';
import { UserItemsMemoryRepository } from '@/repositories/in-memory/user-items.memory.repository';
import { SessionsMemoryRepository } from '@/repositories/in-memory/sessions.memory.repository';
import { GenresMemoryRepository } from '@/repositories/in-memory/genres.memory.repository';
import { ItemGenresMemoryRepository } from '@/repositories/in-memory/item-genres.memory.repository';
import { DatabaseService } from '@/modules/database/database.service';

const useMemory = process.env.NODE_ENV === 'test';

@Global()
@Module({
  imports: [ConfigModule, DatabaseModule],
  providers: [
    {
      provide: 'IUsersRepository',
      useFactory: (databaseService: DatabaseService) => {
        return useMemory ? new UsersMemoryRepository() : new UsersRepository(databaseService);
      },
      inject: [DatabaseService],
    },
    {
      provide: 'IItemsRepository',
      useFactory: (databaseService: DatabaseService) => {
        return useMemory ? new ItemsMemoryRepository() : new ItemsRepository(databaseService);
      },
      inject: [DatabaseService],
    },
    {
      provide: 'IUserItemsRepository',
      useFactory: (databaseService: DatabaseService) => {
        return useMemory ? new UserItemsMemoryRepository() : new UserItemsRepository(databaseService);
      },
      inject: [DatabaseService],
    },
    {
      provide: 'ISessionsRepository',
      useFactory: (databaseService: DatabaseService) => {
        return useMemory ? new SessionsMemoryRepository() : new SessionsRepository(databaseService);
      },
      inject: [DatabaseService],
    },
    {
      provide: 'IGenresRepository',
      useFactory: (databaseService: DatabaseService) => {
        return useMemory ? new GenresMemoryRepository() : new GenresRepository(databaseService);
      },
      inject: [DatabaseService],
    },
    {
      provide: 'IItemGenresRepository',
      useFactory: (databaseService: DatabaseService) => {
        return useMemory ? new ItemGenresMemoryRepository() : new ItemGenresRepository(databaseService);
      },
      inject: [DatabaseService],
    },
  ],
  exports: ['IUsersRepository', 'IItemsRepository', 'IUserItemsRepository', 'ISessionsRepository', 'IGenresRepository', 'IItemGenresRepository'],
})
export class RepositoryConfigModule { }
