import { Module } from '@nestjs/common';
import { ItemGenresService } from './item-genres.service';
import { ItemGenresController } from './item-genres.controller';
import { RepositoryConfigModule } from '@/modules/repository-config/repository-config.module';

@Module({
  imports: [RepositoryConfigModule],
  controllers: [ItemGenresController],
  providers: [ItemGenresService],
  exports: [ItemGenresService],
})
export class ItemGenresModule { }
