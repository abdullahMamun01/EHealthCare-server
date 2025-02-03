import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import sendResponse from 'src/utils/sendResponse';
import { updateDoctorDto } from './dto/update-doctor.dto';
import { Doctor, Prisma } from '@prisma/client';
import { PaginationService } from 'src/pagination/pagination.service';
@Injectable()
export class DoctorService {
  constructor(
    private readonly prismaService: PrismaService,
    private paginationService: PaginationService,
  ) {}

  async getAllDoctors(query: Record<string, unknown>) {
    return this.paginationService.paginate('doctor', query);
  }

  async createAppointment() {}

  async updateAppointment() {}

  async deleteAppointment() {}
}
