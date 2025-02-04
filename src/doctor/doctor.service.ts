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
  ) {
    this.paginationService.setModel('doctor');
  }

  async getAllDoctors(query: Record<string, unknown>) {

    const search = query.searchTerm || ""
  
    return await this.paginationService.paginate(query).search(search as string, ['name'] ,).execute();
  }

  async createAppointment() {}

  async updateAppointment() {}

  async deleteAppointment() {}
}
