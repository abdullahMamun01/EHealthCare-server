import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import sendResponse from 'src/utils/sendResponse';
import { updateDoctorDto } from './dto/update-doctor.dto';
import { Doctor, Prisma } from '@prisma/client';
@Injectable()
export class DoctorService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllDoctors() {
    return sendResponse({
      status: 200,
      success: true,
      data: await this.prismaService.doctor.findMany(),
      message: 'Doctors retrieved successfully',
    });
  }

  async updateDoctor(payload: Partial<Doctor>, email: string) {
    const isExist = await this.prismaService.doctor.findUnique({
      where: { email },
    });

    if (!isExist) {
      throw new HttpException('Doctor not found', HttpStatus.NOT_FOUND);
    }

    const updatedDoctor = await this.prismaService.doctor.update({
      where: { email },
      data: payload,
    });

    return updatedDoctor
  }

  async createAppointment() {}

  async updateAppointment() {}

  async deleteAppointment() {}
}
