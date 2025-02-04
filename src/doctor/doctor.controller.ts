import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { Public } from 'src/auth/metadata';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role, Roles } from 'src/guard/role/roles.decorator';
import { ZodValidationPipe } from 'src/others/zodValidationPipe';
import {
  DoctorSpecialtiesDto,
  doctorSpecialtiesSchema,
} from './dto/doctor-speciality.dto';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Public()
  @Get()
  getAllDoctors(@Query() query: Record<string, unknown>) {
    return this.doctorService.getAllDoctors(query);
  }

  @Roles(Role.Doctor)
  @Post('create-speciality')
  @UsePipes(new ZodValidationPipe(doctorSpecialtiesSchema))
  async createdSepciality(
    @Request() req: any,
    @Body() doctorSpecialtiesDto: DoctorSpecialtiesDto,
  ) {

    return await this.doctorService.createSpeciality(doctorSpecialtiesDto, req.user.doctor_id);
  }
}
