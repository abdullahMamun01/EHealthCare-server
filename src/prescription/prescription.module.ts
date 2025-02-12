import { Module } from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { PrescriptionController } from './prescription.controller';
import { PaginationService } from 'src/pagination/pagination.service';

@Module({
  controllers: [PrescriptionController],
  providers: [PrescriptionService, PaginationService],
})
export class PrescriptionModule {}
