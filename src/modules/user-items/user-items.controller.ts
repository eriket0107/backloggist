import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserItemsService } from './user-items.service';
import { AddToBacklogDto } from './dto/add-to-backlog.dto';
import { UpdateUserItemDto } from './dto/update-user-item.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FindAllBacklogDto } from './dto/find-all-backlog.dto';

@UseGuards(AuthGuard)
@ApiTags('user-items')
@Controller('backlog')
export class UserItemsController {
  constructor(private readonly userItemsService: UserItemsService) { }

  @Post()
  @ApiOperation({ summary: 'Add item to user backlog' })
  @ApiResponse({ status: 201, description: 'Item added to backlog successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  addToBacklog(
    @Body() addToBacklogDto: AddToBacklogDto,
    @Request() req,
  ) {
    const userId = req.user.sub
    return this.userItemsService.addToBacklog(userId, addToBacklogDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user backlog' })
  @ApiResponse({ status: 200, description: 'User backlog retrieved successfully' })
  getUserBacklog(@Request() req, @Query() { limit, page, search, type }: FindAllBacklogDto) {
    const userId = req.user.sub
    return this.userItemsService.getUserBacklog({ limit, page, type, search, userId, });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user backlog statistics' })
  @ApiResponse({ status: 200, description: 'Backlog statistics retrieved successfully' })
  getBacklogStats(@Request() req) {
    const userId = req.user.sub
    return this.userItemsService.getBacklogStats(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user item' })
  @ApiResponse({ status: 200, description: 'User item updated successfully' })
  @ApiResponse({ status: 404, description: 'User item not found' })
  updateUserItem(
    @Request() req,
    @Param('id') id: string,
    @Body() updateUserItemDto: UpdateUserItemDto
  ) {
    const userId = req.user.sub
    return this.userItemsService.updateUserItem(userId, id, updateUserItemDto);
  }

  @Delete(':itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove item from user backlog' })
  @ApiResponse({ status: 204, description: 'Item removed from backlog successfully' })
  @ApiResponse({ status: 404, description: 'User item not found' })
  removeFromBacklog(
    @Request() req,
    @Param('itemId') itemId: string
  ) {
    const userId = req.user.sub
    return this.userItemsService.removeFromBacklog(userId, itemId);
  }
}
