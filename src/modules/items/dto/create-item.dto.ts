import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({ example: 'The Witcher 3' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example: 'game',
    enum: ['game', 'book', 'serie', 'movie', 'course']
  })
  @IsString()
  @IsIn(['game', 'book', 'serie', 'movie', 'course'])
  type!: 'game' | 'book' | 'serie' | 'movie' | 'course';

  @ApiProperty({ example: 'An amazing RPG game', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsOptional()
  @IsString()
  imgUrl?: string;
}
