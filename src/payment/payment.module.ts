import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { StripeService } from 'src/stripe/stripe.service';
import { AppointmentService } from 'src/appointment/appointment.service';
import { AppointmentController } from 'src/appointment/appointment.controller';
import { AppointmentModule } from 'src/appointment/appointment.module';
import { PaginationService } from 'src/pagination/pagination.service';

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    StripeService,
    AppointmentService,
    PaginationService,
  ],
})
export class PaymentModule {}
