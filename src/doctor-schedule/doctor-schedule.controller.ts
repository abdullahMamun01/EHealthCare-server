import { Controller } from '@nestjs/common';
import { DoctorScheduleService } from './doctor-schedule.service';

@Controller('doctor-schedule')
export class DoctorScheduleController {
  constructor(private readonly doctorScheduleService: DoctorScheduleService) {}
}
