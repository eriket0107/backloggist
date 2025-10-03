import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './utils/logger/logger.module';
import { DatabaseModule } from './modules/database/database.module';
import { RepositoryConfigModule } from './modules/repository-config/repository-config.module';
import { UsersModule } from './modules/users/users.module';
import { ItemsModule } from './modules/items/items.module';
import { UserItemsModule } from './modules/user-items/user-items.module';
import { GenresModule } from './modules/genres/genres.module';
import { ItemGenresModule } from './modules/item-genres/item-genres.module';
import { AuthModule } from './modules/auth/auth.module';
import { PasswordHandlerModule } from './utils/password-handler/password-handler.module';
import { StaticModule } from './utils/static/static.module';

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
    GenresModule,
    ItemGenresModule,
    AuthModule,
    PasswordHandlerModule,
    StaticModule,
  ],
})
export class AppModule { }
