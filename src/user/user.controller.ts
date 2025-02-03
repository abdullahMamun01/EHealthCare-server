import {
  Controller,
  Get,
  Patch,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Role, Roles } from 'src/guard/role/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { z } from 'zod';
import { patientUpdateSchema } from './dto/patient-update.dto';
import { updateDoctorSchema } from 'src/doctor/dto/update-doctor.dto';
import { ZodValidationPipe } from 'src/others/zodValidationPipe';
import { Admin, Doctor, Patient } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.User, Role.Doctor, Role.Admin)
  @Patch('update-my-profile')
  @UseInterceptors(FileInterceptor('file'))
  async updateMyProfile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    const role = req.user.role;
    if (role === Role.User) {
      new ZodValidationPipe(patientUpdateSchema.strict()).transform(req.body, {
        type: 'body',
      });
    } else if (role === Role.Doctor) {
      new ZodValidationPipe(updateDoctorSchema.strict()).transform(req.body, {
        type: 'body',
      });
    }

    return this.userService.updateProfile(req.body, req.user.email, file);
  }
}
