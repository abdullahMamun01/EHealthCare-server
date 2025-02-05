import { Body, Controller, Post, Request, UsePipes } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Public } from 'src/auth/metadata';
import { ScheduleDto, scheduleSchema } from './dto/schedule.dot';
import { ZodValidationPipe } from 'src/others/zodValidationPipe';
import { differenceInDays,parse, differenceInMinutes, addMinutes } from 'date-fns';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Public()
  @Post()
  @UsePipes(new ZodValidationPipe(scheduleSchema))
  async createSchedule(@Request() req , @Body() scheduleDto: ScheduleDto) {
    const startDate  =  parse(scheduleDto.startTime , "HH:mm" , new Date())
    const endDate = parse(scheduleDto.endTime , "HH:mm" , new Date())
    return this.scheduleService.createSchedule(scheduleDto)
  }
}
