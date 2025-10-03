import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGenreDto {
  @ApiProperty({ example: 'Action' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
