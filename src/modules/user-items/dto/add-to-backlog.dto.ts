import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToBacklogDto {
  @ApiProperty({ example: 'item-uuid-here' })
  @IsString()
  @IsNotEmpty()
  itemId!: string;

  @ApiProperty({
    example: 'pending',
    enum: ['completed', 'in_progress', 'pending'],
    required: false
  })
  @IsOptional()
  @IsString()
  @IsIn(['completed', 'in_progress', 'pending'])
  status?: 'completed' | 'in_progress' | 'pending';
}
