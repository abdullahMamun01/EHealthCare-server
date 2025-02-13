import {
  Controller,
  Patch,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Role, Roles } from 'src/guard/role/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { patientUpdateSchema } from './dto/patient-update.dto';
import { updateDoctorSchema } from 'src/doctor/dto/update-doctor.dto';
import { ZodValidationPipe } from 'src/others/zodValidationPipe';
import { JwtPayload } from 'src/jwt-auth/jwt.interface';

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
    const user = req.user as JwtPayload;
    const role = user.role;
    if (role === 'PATIENT') {
      new ZodValidationPipe(patientUpdateSchema.strict()).transform(req.body);
    } else if (role === 'DOCTOR') {
      new ZodValidationPipe(updateDoctorSchema.strict()).transform(req.body);
    }

    return this.userService.updateProfile(req.body, req.user.email, file);
  }
}
