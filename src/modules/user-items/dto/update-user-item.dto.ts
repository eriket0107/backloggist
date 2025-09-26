import { IsOptional, IsNumber, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserItemDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({
    example: 'in_progress',
    enum: ['completed', 'in_progress', 'pending'],
    required: false
  })
  @IsOptional()
  @IsString()
  @IsIn(['completed', 'in_progress', 'pending'])
  status?: 'completed' | 'in_progress' | 'pending';

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsNumber()
  rating?: number;
}
