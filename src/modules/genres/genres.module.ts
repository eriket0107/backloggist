import { Module } from '@nestjs/common';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { RepositoryConfigModule } from '@/modules/repository-config/repository-config.module';

@Module({
  imports: [RepositoryConfigModule],
  controllers: [GenresController],
  providers: [GenresService],
  exports: [GenresService],
})
export class GenresModule { }
