import { IsOptional, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class FindAllGenresDto {
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
}
