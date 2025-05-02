import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PaginationService } from 'src/pagination/pagination.service';

@Module({
  controllers: [PatientController],
  providers: [PatientService, CloudinaryService,PaginationService],
})
export class PatientModule {}
