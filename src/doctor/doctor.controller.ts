import { Body, Controller, Get, Param, Patch, Query, Request } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { Public } from 'src/auth/metadata';


@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Public()
  @Get()
  getAllDoctors(@Query() query: Record<string ,unknown>) {
    return this.doctorService.getAllDoctors(query);
  }


}
