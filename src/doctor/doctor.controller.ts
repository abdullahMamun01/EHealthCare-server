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
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { Public } from 'src/auth/metadata';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role, Roles } from 'src/guard/role/roles.decorator';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Public()
  @Get()
  getAllDoctors(@Query() query: Record<string, unknown>) {
    return this.doctorService.getAllDoctors(query);
  }
  
}
