import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UsePipes,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Public } from 'src/auth/metadata';
import { ScheduleDto, scheduleSchema } from './dto/schedule.dot';
import { ZodValidationPipe } from 'src/others/zodValidationPipe';
import {
  differenceInDays,
  parse,
  differenceInMinutes,
  addMinutes,
} from 'date-fns';
import { Role, Roles } from 'src/guard/role/roles.decorator';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Public()
  @Post()
  @UsePipes(new ZodValidationPipe(scheduleSchema))
  async createSchedule(@Request() req, @Body() scheduleDto: ScheduleDto) {
    const startDate = parse(scheduleDto.startTime, 'HH:mm', new Date());
    const endDate = parse(scheduleDto.endTime, 'HH:mm', new Date());
    return this.scheduleService.createSchedule(scheduleDto);
  }
  @Roles(Role.Doctor, Role.Admin)
  @Get()
  async getAllSchedule(@Query() query: any) {
    return this.scheduleService.getAllSchedules(query.startDate, query.endDate);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async deletedScheduleById(@Param('id') scheduleId: string) {
    return this.scheduleService.deletedScheduleById(scheduleId);
  }
}
