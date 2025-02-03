import { Body, Controller, Get, Param, Patch, Request } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { Public } from 'src/auth/metadata';
import { Role, Roles } from 'src/guard/role/roles.decorator';
import { updateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from '@prisma/client';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Public()
  @Get()
  getAllDoctors() {
    return this.doctorService.getAllDoctors();
  }
  

}
