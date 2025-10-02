import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class LogIndexService {
  private readonly logger = new Logger(LogIndexService.name);
  private readonly logsPath = join(process.cwd(), 'logs');
  private readonly indexFileName = 'index.txt';

  async generateLogIndex(): Promise<void> {
    try {
      const files = await fs.readdir(this.logsPath);

      const logFiles = files.filter(file =>
        file !== this.indexFileName &&
        file !== 'index' &&
        file.endsWith('.txt')
      );

      const indexContent = await this.createIndexContent(logFiles);

      const indexPath = join(this.logsPath, this.indexFileName);
      await fs.writeFile(indexPath, indexContent, 'utf8');

      this.logger.log(`Generated log index with ${logFiles.length} files`);
    } catch (error) {
      this.logger.error('Failed to generate log index', error);
    }
  }

  private async createIndexContent(logFiles: string[]): Promise<string> {
    const lines = ['Log Files Index', '==================', ''];

    for (const file of logFiles.sort()) {
      try {
        const filePath = join(this.logsPath, file);
        const stats = await fs.stat(filePath);
        const sizeKB = Math.round(stats.size / 1024);
        const lastModified = stats.mtime.toISOString().split('T')[0];

        lines.push(`${file} (${sizeKB}KB, modified: ${lastModified})`);
        lines.push(`  Path: /logs/${file}`);
        lines.push('');
      } catch (error) {
        lines.push(`${file} (error reading file info)`);
        lines.push('');
        console.error(error)
      }
    }

    lines.push(`Generated: ${new Date().toISOString()}`);
    return lines.join('\n');
  }

  async refreshIndex(): Promise<void> {
    await this.generateLogIndex();
  }
}
