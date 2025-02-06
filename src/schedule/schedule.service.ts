import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Schedule } from '@prisma/client';
import {
  addDays,
  addMinutes,
  differenceInDays,
  differenceInMinutes,
  endOfDay,
  parse,
  startOfDay,
} from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScheduleDto } from './dto/schedule.dot';
import sendResponse from 'src/utils/sendResponse';
import generateSchedules from './schedule.utils';

@Injectable()
export class ScheduleService {
  constructor(private readonly prismaService: PrismaService) {}

  async createSchedule(payload: ScheduleDto) {
    const startTime = parse(
      payload.startTime,
      'HH:mm',
      new Date(payload.startDate),
    );
    const endTime = parse(
      payload.endTime,
      'HH:mm',
      new Date(payload.startDate),
    );

    const totalDays = differenceInDays(payload.endDate, payload.startDate);
    const totalHours = differenceInMinutes(endTime, startTime) / 60;
    const schedules = Array.from({ length: totalDays + 1 }, (_, i) => {
      const date = addDays(startTime, i);
      return generateSchedules(date, totalHours);
    }).flat();

    const alreadySchedule = await this.getSchedulesByTime(
      schedules as Schedule[],
    );

    if (alreadySchedule.length > 0) {
      throw new HttpException('Schedule already exists', HttpStatus.CONFLICT);
    }

    // // await this.prismaService.schedule.deleteMany({});

    await this.prismaService.schedule.createMany({
      data: schedules,
    });
    const data = await this.getSchedulesByTime(schedules as Schedule[]);
    return sendResponse({
      message: 'Schedule created successfully',
      success: true,
      status: 200,
      data,
    });
  }

  private async getSchedulesByTime(schedules: Schedule[]) {
    return this.prismaService.schedule.findMany({
      where: {
        OR: schedules.map(({ startTime, endTime }) => ({
          startTime: { gte: startTime },
          endTime: { lte: endTime },
        })),
      },
    });
  }

  async getAllSchedules(startDate?: Date, endDate?: Date) {
    const currentDate = addDays(new Date(), 0);
    const startDateTime = startDate ? startOfDay(startDate) : startOfDay(currentDate);
    const endDateTime = endOfDay(endDate ?? startDate ?? currentDate)
    const schedules = await this.prismaService.schedule.findMany({
      where: {
        startTime: { gte: startDateTime },
         endTime: { lte: endDateTime } ,
      },      
      orderBy: {
        startTime: 'asc',
      },
    });
    return sendResponse({
      message: 'Schedules retrieved successfully',
      success: true,
      status: 200,
      data: {total:schedules.length,schedules },
    })
  }

  async deletedScheduleById(scheduleId: string) {
    await this.prismaService.schedule.findUniqueOrThrow({
      where : {
        id : scheduleId
      }
    })
    const deleteSchedule = await this.prismaService.schedule.delete({
      where: {
        id: scheduleId
      }
    })

    return sendResponse({
      message: 'Schedule deleted successfully',
      success: true,
      status: 200,
      data: deleteSchedule,
    });
  }
}
