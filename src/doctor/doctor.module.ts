import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { PaginationService } from 'src/pagination/pagination.service';
import { PaginationModule } from 'src/pagination/pagination.module';

@Module({
  imports: [PaginationModule],
  controllers: [DoctorController],
  providers: [DoctorService, PaginationService],
})
export class DoctorModule {}
