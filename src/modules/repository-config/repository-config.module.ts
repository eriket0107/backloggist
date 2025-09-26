import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@/modules/database/database.module';
import { UsersRepository } from '@/repositories/drizzle-repository/users.repository';
import { ItemsRepository } from '@/repositories/drizzle-repository/items.repository';
import { UserItemsRepository } from '@/repositories/drizzle-repository/user-items.repository';
import { UsersMemoryRepository } from '@/repositories/in-memory/users.memory.repository';
import { ItemsMemoryRepository } from '@/repositories/in-memory/items.memory.repository';
import { UserItemsMemoryRepository } from '@/repositories/in-memory/user-items.memory.repository';
import { DatabaseService } from '@/modules/database/database.service';

@Module({
  imports: [ConfigModule, DatabaseModule],
  providers: [
    {
      provide: 'IUsersRepository',
      useFactory: (databaseService: DatabaseService) => {
        const useMemory = process.env.USE_MEMORY_REPOSITORIES === 'true';
        return useMemory ? new UsersMemoryRepository() : new UsersRepository(databaseService);
      },
      inject: [DatabaseService],
    },
    {
      provide: 'IItemsRepository',
      useFactory: (databaseService: DatabaseService) => {
        const useMemory = process.env.USE_MEMORY_REPOSITORIES === 'true';
        return useMemory ? new ItemsMemoryRepository() : new ItemsRepository(databaseService);
      },
      inject: [DatabaseService],
    },
    {
      provide: 'IUserItemsRepository',
      useFactory: (databaseService: DatabaseService) => {
        const useMemory = process.env.USE_MEMORY_REPOSITORIES === 'true';
        return useMemory ? new UserItemsMemoryRepository() : new UserItemsRepository(databaseService);
      },
      inject: [DatabaseService],
    },
  ],
  exports: ['IUsersRepository', 'IItemsRepository', 'IUserItemsRepository'],
})
export class RepositoryConfigModule { }
