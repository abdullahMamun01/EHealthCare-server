import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';

import { Role, Roles } from 'src/guard/role/roles.decorator';
import { ZodValidationPipe } from 'src/others/zodValidationPipe';
import {
  adminSchema,
  CreateAdminDto,
  CreateDoctorDto,
  createDoctorSchema,
} from './dto/create-admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles(Role.Admin)
  @Post('create-doctor')
  @UseInterceptors(FileInterceptor('file'))
  createDoctor(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ZodValidationPipe(createDoctorSchema))
    createDoctorDto: CreateDoctorDto,
  ) {
    return this.adminService.createDoctor(createDoctorDto, file);
  }

  @Roles(Role.Admin)
  @Post('create-admin')
  @UseInterceptors(FileInterceptor('file'))
  async createAdmin(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ZodValidationPipe(adminSchema)) createAdminDto: CreateAdminDto,
  ) {
    return this.adminService.createAdmin(createAdminDto, file);
  }
}
