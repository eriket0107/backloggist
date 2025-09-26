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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserItemsService } from './user-items.service';
import { AddToBacklogDto } from './dto/add-to-backlog.dto';
import { UpdateUserItemDto } from './dto/update-user-item.dto';

@ApiTags('user-items')
@Controller('users/:userId/backlog')
export class UserItemsController {
  constructor(private readonly userItemsService: UserItemsService) { }

  @Post()
  @ApiOperation({ summary: 'Add item to user backlog' })
  @ApiResponse({ status: 201, description: 'Item added to backlog successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  addToBacklog(
    @Param('userId') userId: string,
    @Body() addToBacklogDto: AddToBacklogDto
  ) {
    return this.userItemsService.addToBacklog(userId, addToBacklogDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user backlog' })
  @ApiResponse({ status: 200, description: 'User backlog retrieved successfully' })
  getUserBacklog(@Param('userId') userId: string) {
    return this.userItemsService.getUserBacklog(userId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user backlog statistics' })
  @ApiResponse({ status: 200, description: 'Backlog statistics retrieved successfully' })
  getBacklogStats(@Param('userId') userId: string) {
    return this.userItemsService.getBacklogStats(userId);
  }

  @Patch(':itemId')
  @ApiOperation({ summary: 'Update user item' })
  @ApiResponse({ status: 200, description: 'User item updated successfully' })
  @ApiResponse({ status: 404, description: 'User item not found' })
  updateUserItem(
    @Param('userId') userId: string,
    @Param('itemId') itemId: string,
    @Body() updateUserItemDto: UpdateUserItemDto
  ) {
    return this.userItemsService.updateUserItem(userId, itemId, updateUserItemDto);
  }

  @Delete(':itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove item from user backlog' })
  @ApiResponse({ status: 204, description: 'Item removed from backlog successfully' })
  @ApiResponse({ status: 404, description: 'User item not found' })
  removeFromBacklog(
    @Param('userId') userId: string,
    @Param('itemId') itemId: string
  ) {
    return this.userItemsService.removeFromBacklog(userId, itemId);
  }
}
