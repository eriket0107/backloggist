import { IsOptional, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class FindAllGenresDto {
  @ApiProperty({ required: false, example: '10' })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  @ApiProperty({ required: false, example: '1' })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page?: number;


  @ApiProperty({ required: false, example: "Action" })
  @IsOptional()
  @IsString()
  search?: string;
}


