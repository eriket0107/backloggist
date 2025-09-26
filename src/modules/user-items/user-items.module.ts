import { Module } from '@nestjs/common';
import { UserItemsService } from './user-items.service';
import { UserItemsController } from './user-items.controller';
import { RepositoryConfigModule } from '@/modules/repository-config/repository-config.module';

@Module({
  imports: [RepositoryConfigModule],
  controllers: [UserItemsController],
  providers: [UserItemsService],
  exports: [UserItemsService],
})
export class UserItemsModule { }
