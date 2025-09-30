import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RepositoryConfigModule } from '@/modules/repository-config/repository-config.module';
import { PasswordHandlerModule } from '@/ultils/password-handler.module';

@Module({
  imports: [RepositoryConfigModule, PasswordHandlerModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
