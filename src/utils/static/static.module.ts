
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LogIndexService } from './log-index.service';
import { LogsController } from './logs.controller';
import { BasicAuthGuard } from './basic-auth.guard';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'logs'),
      serveRoot: '/logs',
    }),
  ],
  controllers: [LogsController],
  providers: [LogIndexService, BasicAuthGuard],
  exports: [LogIndexService],
})

export class StaticModule {
  constructor(private logIndexService: LogIndexService) {
    this.logIndexService.generateLogIndex();
  }
}
