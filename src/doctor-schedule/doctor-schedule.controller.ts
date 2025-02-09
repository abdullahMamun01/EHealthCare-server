import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { DoctorScheduleService } from './doctor-schedule.service';
import { Role, Roles } from 'src/guard/role/roles.decorator';
import { Public } from 'src/auth/metadata';

@Controller('doctor-schedules')
export class DoctorScheduleController {
  constructor(private readonly doctorScheduleService: DoctorScheduleService) {}

  @Roles(Role.Doctor)
  @Post()
  async createSchedule(@Request() req: any, @Body() schedules: string[]) {
    return this.doctorScheduleService.createSchedule(
      schedules,
      req.user.doctor_id,
    );
  }

  @Roles(Role.Doctor)
  @Get()
  async getDcotorsSchedule(@Request() req: any) {
    return this.doctorScheduleService.doctorSchedule(req.user.doctor_id);
  }
  @Public()
  @Get('availability')
  async getDoctorAvailability() {
    return this.doctorScheduleService.getAllDoctorSchedule();
  }
}
