import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { promises as fs } from 'fs';
import { BasicAuthGuard } from './basic-auth.guard';

@Controller('logs')
@UseGuards(BasicAuthGuard)
export class LogsController {
  private readonly logsPath = join(process.cwd(), 'logs');

  @Get('index.txt')
  async getIndex(@Res() res: Response) {
    const indexPath = join(this.logsPath, 'index.txt');
    return res.sendFile(indexPath);
  }

  @Get(':filename')
  async getLogFile(@Param('filename') filename: string, @Res() res: Response) {
    // Validate filename to prevent path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const filePath = join(this.logsPath, filename);

    try {
      await fs.access(filePath);
      return res.sendFile(filePath);
    } catch {
      return res.status(404).json({ error: 'File not found' });
    }
  }
}
