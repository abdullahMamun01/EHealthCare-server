import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { PaginationService } from 'src/pagination/pagination.service';

@Module({
  controllers: [DoctorController],
  providers: [DoctorService, PaginationService],
})
export class DoctorModule {}
