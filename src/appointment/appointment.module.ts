import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { PaginationService } from 'src/pagination/pagination.service';

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService,PaginationService],
})
export class AppointmentModule {}
