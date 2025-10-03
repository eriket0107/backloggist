import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ItemGenresService } from './item-genres.service';
import { CreateItemGenreDto } from './dto/create-item-genre.dto';
import { FindAllItemGenresDto } from './dto/find-all-item-genres.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@ApiTags('item-genres')
@Controller('item-genres')
export class ItemGenresController {
  constructor(private readonly itemGenresService: ItemGenresService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new item-genre relationship' })
  @ApiResponse({ status: 201, description: 'Item-Genre relationship created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Item or Genre not found' })
  @ApiResponse({ status: 409, description: 'Item-Genre relationship already exists' })
  create(@Body() createItemGenreDto: CreateItemGenreDto) {
    return this.itemGenresService.create(createItemGenreDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all item-genre relationships' })
  @ApiResponse({ status: 200, description: 'Item-Genre relationships retrieved successfully' })
  findAll(@Query() query: FindAllItemGenresDto) {
    return this.itemGenresService.findAll(query);
  }

  @Get('item/:itemId')
  @ApiOperation({ summary: 'Get all genres for a specific item' })
  @ApiResponse({ status: 200, description: 'Genres for item retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  findByItem(@Param('itemId') itemId: string) {
    return this.itemGenresService.findByItem(itemId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item-genre relationship by ID' })
  @ApiResponse({ status: 200, description: 'Item-Genre relationship found' })
  @ApiResponse({ status: 404, description: 'Item-Genre relationship not found' })
  findOne(@Param('id') id: string) {
    return this.itemGenresService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete item-genre relationship by ID' })
  @ApiResponse({ status: 204, description: 'Item-Genre relationship deleted successfully' })
  @ApiResponse({ status: 404, description: 'Item-Genre relationship not found' })
  remove(@Param('id') id: string) {
    return this.itemGenresService.remove(id);
  }

  @Delete('item/:itemId/genre/:genreId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete item-genre relationship by item and genre IDs' })
  @ApiResponse({ status: 204, description: 'Item-Genre relationship deleted successfully' })
  @ApiResponse({ status: 404, description: 'Item-Genre relationship not found' })
  removeByItemAndGenre(
    @Param('itemId') itemId: string,
    @Param('genreId') genreId: string
  ) {
    return this.itemGenresService.removeByItemAndGenre(itemId, genreId);
  }
}
