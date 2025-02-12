import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma/prisma.service';
import sendResponse from 'src/utils/sendResponse';
import { ReviewDto } from './dto/review.dto';
import { Reviews } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(
    private readonly prismaService: PrismaService,
    private paginationService: PaginationService,
  ) {
    this.paginationService.setModel('reviews');
  }

  async getAllReviews(query: Record<string, unknown>) {
    const { doctorId, patientId } = query;
    const filterConditions = [];
    if (doctorId) {
      filterConditions.push({
        fieldName: 'doctorId',
        value: doctorId,
      });
    } else if (patientId) {
      filterConditions.push({
        fieldName: 'patientId',
        value: patientId,
      });
    }

    return await this.paginationService
      .paginate(query)
      .find(filterConditions)
      .execute();
  }
  async getReviewById(reviewId: string) {
    const reviews = await this.prismaService.reviews.findUnique({
      where: {
        id: reviewId,
      },
    });
    return sendResponse({
      status: 200,
      success: true,
      data: reviews,
      message: 'Review retrieved successfully',
    });
  }

  async createReview(patientId: string, reviewDto: ReviewDto) {
    const appointment = await this.prismaService.appointment.findUniqueOrThrow({
      where: { id: reviewDto.appointmentId, patientId },
    });

    if (appointment.status !== 'COMPLETED') {
      throw new HttpException(
        'You can only leave a review for a completed appointment!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hasReview = await this.prismaService.reviews.findFirst({
      where: {
        patientId,
        doctorId: appointment.doctorId,
      },
    });

    if (hasReview) {
      throw new HttpException(
        'You have already left a review for this doctor!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const review = await this.prismaService.reviews.create({
      data: {
        ...reviewDto,
        patientId,
        doctorId: appointment.doctorId,
      } as Reviews,
    });
    return sendResponse({
      status: 200,
      success: true,
      data: review,
      message: 'Review created successfully',
    });
  }

  async updateReview(
    reviewId: string,
    reviewDto: ReviewDto,
    patientId: string,
  ) {
    await this.prismaService.reviews.findUniqueOrThrow({
      where: { id: reviewId, patientId },
    });
    const updatedReview = await this.prismaService.reviews.update({
      where: { id: reviewId, patientId },
      data: reviewDto,
    });

    return sendResponse({
      status: 200,
      success: true,
      data: updatedReview,
      message: 'Review updated successfully',
    });
  }
}
