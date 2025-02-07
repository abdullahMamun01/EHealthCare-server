import { Body, Controller, Post, Request } from '@nestjs/common';
import { DoctorScheduleService } from './doctor-schedule.service';
import { Role, Roles } from 'src/guard/role/roles.decorator';

@Controller('doctor-schedules')
export class DoctorScheduleController {
  constructor(private readonly doctorScheduleService: DoctorScheduleService) {}

  @Roles(Role.Doctor)
  @Post()
  async createSchedule(@Request() req : any ,@Body() schedules: string[]) {
    return this.doctorScheduleService.createSchedule(schedules, req.user.doctor_id);
  }
}
