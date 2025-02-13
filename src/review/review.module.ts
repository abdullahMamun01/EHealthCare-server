import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PaginationService } from 'src/pagination/pagination.service';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, PaginationService],
})
export class ReviewModule {}
