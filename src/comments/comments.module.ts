import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentEntity } from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalEntity } from 'src/rentals/entities/rental.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RentalEntity,CommentEntity]),],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
