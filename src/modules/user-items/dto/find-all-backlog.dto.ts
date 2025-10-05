import { IsOptional, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Item } from '@/types/entities';

export class FindAllBacklogDto {
  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @ApiProperty({ example: "Item title", required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ example: "Item type", required: false })
  @IsOptional()
  @IsString()
  type?: Item['type'];
}
