import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';

import { ActiveUser } from '../common/decorators/active_user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { UserActiveInterface } from '../common/interface/user-active.interface';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('/rentals/:rentalId')
  @UseGuards(AuthGuard)
  create(
    @Param('rentalId', ParseIntPipe) rentalId: number,
    @Body() createCommentDto: CreateCommentDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.commentsService.create(createCommentDto, user, rentalId);
  }

  @Get()
  findAll(
    createCommentDto: CreateCommentDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.commentsService.findAll(createCommentDto, user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: number, @ActiveUser() user: UserActiveInterface) {
    return this.commentsService.findOne(id, user);
  }

  @Patch(':id/rentals/:rental_id')
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Param('rental_id', ParseIntPipe) rental_id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.commentsService.update(id, updateCommentDto, user, rental_id);
  }

  @Delete(':id/rentals/:rental_id')
  @UseGuards(AuthGuard)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Param('rental_id', ParseIntPipe) rental_id: number,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.commentsService.remove(id, user, rental_id);
  }

  //Adicionales fuera del crud

  @Get('rentals/:rental_id')
  findAllByRental(@Param('rental_id', ParseIntPipe) rental_id: number) {
    return this.commentsService.findAllByRental(rental_id);
  }
}
