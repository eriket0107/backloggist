import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGenreDto {
  @ApiProperty({ example: 'Adventure', required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
