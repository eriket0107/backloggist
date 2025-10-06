
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LogIndexService } from './log-index.service';
import { LogsController } from './logs.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'logs'),
      serveRoot: '/logs',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [LogsController],
  providers: [LogIndexService],
  exports: [LogIndexService],
})

export class StaticModule {
  constructor(private logIndexService: LogIndexService) {
    this.logIndexService.generateLogIndex();
  }
}
