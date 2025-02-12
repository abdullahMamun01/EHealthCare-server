import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UsePipes,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Public } from 'src/auth/metadata';
import { Role, Roles } from 'src/guard/role/roles.decorator';
import { ZodValidationPipe } from 'src/others/zodValidationPipe';
import { ReviewDto, reviewSchema, UpdateReviewDto, updateReviewSchema } from './dto/review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Public()
  @Get()
  async getAllReviews(@Query() query: any) {
    return await this.reviewService.getAllReviews(query);
  }

  @Roles(Role.User)
  @Post()
  @UsePipes(new ZodValidationPipe(reviewSchema))
  async createReview(@Request() req: any, @Body() reviewDto: ReviewDto) {
    return this.reviewService.createReview(req.user.patient_id, reviewDto);
  }

  @Roles(Role.User)
  @Patch(':reviewId')
  async updateReview(
    @Param('reviewId') reviewId: string,
    @Request() req: any,
    @Body(new ZodValidationPipe(updateReviewSchema)) reviewDto: UpdateReviewDto,
  ) {
    return this.reviewService.updateReview(
      reviewId,
      reviewDto,
      req.user.patient_id,
    );
  }
}
