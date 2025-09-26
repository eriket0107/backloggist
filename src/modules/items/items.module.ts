import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { RepositoryConfigModule } from '@/modules/repository-config/repository-config.module';

@Module({
  imports: [RepositoryConfigModule],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class ItemsModule { }
