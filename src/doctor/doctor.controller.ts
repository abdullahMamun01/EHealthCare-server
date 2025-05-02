import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UsePipes,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { Public } from 'src/auth/metadata';

import { Role, Roles } from 'src/guard/role/roles.decorator';
import { ZodValidationPipe } from 'src/others/zodValidationPipe';
import {
  DoctorSpecialtiesDto,
  doctorSpecialtiesSchema,
} from './dto/doctor-speciality.dto';
import { updateDoctorDto } from './dto/update-doctor.dto';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Public()
  @Get()
  getAllDoctors(@Query() query: Record<string, unknown>) {
    return this.doctorService.getAllDoctors(query);
  }

  @Get(':id')
  async doctorById(@Param('id') id: string) {
    return await this.doctorService.getDoctorById(id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  async updateDoctor(@Param('id') id: string, @Body() data: updateDoctorDto) {
    return await this.doctorService.updateDoctor(id, data);
  }
  @Roles(Role.Doctor)
  @Post('create-speciality')
  @UsePipes(new ZodValidationPipe(doctorSpecialtiesSchema))
  async createdSepciality(
    @Request() req: any,
    @Body() doctorSpecialtiesDto: DoctorSpecialtiesDto,
  ) {
    return await this.doctorService.createSpeciality(
      doctorSpecialtiesDto,
      req.user.doctor_id,
    );
  }
  @Delete(':id')
  @Roles(Role.Admin)
  async deleteDoctor(@Param('id') id: string) {
    return await this.doctorService.deleteDoctor(id);
  }
}
