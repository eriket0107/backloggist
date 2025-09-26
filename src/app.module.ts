import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './modules/logger/logger.module';
import { DatabaseModule } from './modules/database/database.module';
import { RepositoryConfigModule } from './modules/repository-config/repository-config.module';
import { UsersModule } from './modules/users/users.module';
import { ItemsModule } from './modules/items/items.module';
import { UserItemsModule } from './modules/user-items/user-items.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    DatabaseModule,
    RepositoryConfigModule,
    UsersModule,
    ItemsModule,
    UserItemsModule,
  ],
})
export class AppModule { }
