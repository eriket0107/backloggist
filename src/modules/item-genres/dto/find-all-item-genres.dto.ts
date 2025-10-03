import { IsOptional, IsNumberString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class FindAllItemGenresDto {
  @ApiProperty({ required: false, example: '10' })
  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number;

  @ApiProperty({ required: false, example: '1' })
  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value, 10))
  page?: number;

  @ApiProperty({ required: false, example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsOptional()
  @IsUUID()
  itemId?: string;

  @ApiProperty({ required: false, example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsOptional()
  @IsUUID()
  genreId?: string;
}
