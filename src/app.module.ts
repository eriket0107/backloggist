import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './utils/logger/logger.module';
import { DatabaseModule } from './modules/database/database.module';
import { RepositoryConfigModule } from './modules/repository-config/repository-config.module';
import { UsersModule } from './modules/users/users.module';
import { ItemsModule } from './modules/items/items.module';
import { UserItemsModule } from './modules/user-items/user-items.module';
import { AuthModule } from './modules/auth/auth.module';
import { PasswordHandlerModule } from './utils/password-handler/password-handler.module';

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
    AuthModule,
    PasswordHandlerModule,
  ],
})
export class AppModule { }
