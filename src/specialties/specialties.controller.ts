import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SpecialtiesService } from './specialties.service';
import { Role, Roles } from 'src/guard/role/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { SpecialitesDto, specialitySchema } from './dto/specialites.dto';
import { Specialites } from '@prisma/client';
import { ZodValidationPipe } from 'src/others/zodValidationPipe';
import { Public } from 'src/auth/metadata';

@Controller('specialties')
export class SpecialtiesController {
  constructor(private readonly specialtiesService: SpecialtiesService) {}

  @Roles(Role.Admin)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  createSpeciality(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ZodValidationPipe(specialitySchema))
    specialityDto: SpecialitesDto,
  ) {
    return this.specialtiesService.createSpecility(
      specialityDto as Specialites,
      file,
    );
  }

  @Public()
  @Get()
  getAllSpecialities() {
    return this.specialtiesService.getAllSpecilities();
  }

  @Roles(Role.Admin)
  @Delete(':specilityId')
  deleteSpeciality(
    @Request() req: any,
    @Param('specilityId') specilityId: string,
  ) {
    return this.specialtiesService.deleteSpecility(specilityId);
  }
}
