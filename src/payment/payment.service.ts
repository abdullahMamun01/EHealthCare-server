import { Injectable } from '@nestjs/common';
import { AppointmentService } from 'src/appointment/appointment.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { StripeService } from 'src/stripe/stripe.service';
import sendResponse from 'src/utils/sendResponse';
import { PaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prismaService: PrismaService,
    private stripeService: StripeService,
    private appointmentService: AppointmentService,
  ) {}

  async createPayment(payload: PaymentDto, patientId: string) {
    const { doctorId, scheduleId, problemDescription } = payload;
    const appointment = await this.prismaService.appointment.findFirst({
      where: {
        doctorId,
        scheduleId,
        status: 'PENDING',
      },
    });
    let createAppointment: any;
    if (appointment) {
      createAppointment = appointment;
    } else {
      createAppointment = (
        await this.appointmentService.createAppointment(
          { doctorId, scheduleId, problemDescription },
          patientId,
        )
      ).data;
    }

    const paymentIntent = await this.stripeService.createCheckoutSession(
      [
        {
          name: 'EHealthCare Doctor Appointment',
          price: payload.amount,
          currency: 'usd',
          quantity: 1,
        },
      ],
      {
        appointmentId: createAppointment.id as string,
        patientId,
      },
    );

    return sendResponse({
      data: {
        url: paymentIntent.url,
      },
      success: true,
      status: 200,
      message: 'Payment created successfully',
    });
  }
}

/* 

{
        name: 'EHealthCare',
        price: amount,
        currency,
        quantity: 1,
      },
*/
