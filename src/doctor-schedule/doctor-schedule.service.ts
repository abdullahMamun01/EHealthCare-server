import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DoctorSchedules } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import sendResponse from 'src/utils/sendResponse';

@Injectable()
export class DoctorScheduleService {
  constructor(private readonly prismaService: PrismaService) {}

  async createSchedule(schedules: string[], doctorId: string) {
    await this.prismaService.doctor.findUniqueOrThrow({
      where: { id: doctorId },
    });

    // Fetch existing schedules
    const existingSchedules = await this.getDoctorsSchedule(
      doctorId,
      schedules,
    );
    const existingIds = new Set(existingSchedules.map((s) => s.scheduleId));

    // Filter schedules that do not exist
    const createAbleScheduleIds = schedules.filter(
      (id) => !existingIds.has(id),
    );

    if (createAbleScheduleIds.length === 0) {
      throw new HttpException('Schedule already exists', HttpStatus.CONFLICT);
    }

    // Insert new schedules
    await this.prismaService.doctorSchedules.createMany({
      data: createAbleScheduleIds.map((id) => ({
        scheduleId: id,
        doctorId,
      })) as DoctorSchedules[],
    });

    // Return newly inserted schedules directly
    return sendResponse({
      data: createAbleScheduleIds.map((id) => ({ scheduleId: id, doctorId })),
      message: 'Schedule created successfully',
      success: true,
      status: 200,
    });
  }

  private async getDoctorsSchedule(doctorId: string, scheduleId: string[]) {
    const schedules = await this.prismaService.doctorSchedules.findMany({
      where: {
        doctorId,
        scheduleId: {
          in: scheduleId,
        },
      },
    });
    return schedules;
  }

  async doctorSchedule(doctorId: string) {
    await this.prismaService.doctor.findFirstOrThrow({
      where: {
        id: doctorId,
      },
    });

    const schedules = await this.prismaService.doctorSchedules.findMany({
      where: {
        doctorId,
      },
    });

    return sendResponse({
      data: schedules,
      message: 'Schedules retrieved successfully',
      success: true,
      status: 200,
    });
  }
}
