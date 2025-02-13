import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { LineItem } from './stripe.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    this.stripe = new Stripe(
      this.configService.get('config.stripe.secretKey'),
      {
        apiVersion: '2025-01-27.acacia',
        appInfo: { name: 'EHealthCare' },
      },
    );
  }

  async createPaymentIntent(amount: number = 100, currency: string = 'usd') {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'],
    });
    return paymentIntent;
  }

  async createCheckoutSession(
    items: LineItem[],
    metadata: Record<string, string>,
  ) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items.map((item) => ({
        price_data: {
          currency: item.currency,
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      metadata,
      success_url: `http://localhost:5000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5000/cancel?session_id={CHECKOUT_SESSION_ID}`,
    });

    return session;
  }

  async webhook(signature: string, req: any) {
    const sig = signature;
    const webhookSecret = this.configService.get<string>(
      'config.stripe.webhookSecret',
    );
    const event = this.stripe.webhooks.constructEvent(
      req.rawBody as Buffer,
      sig,
      webhookSecret,
    );
    // const  {metadata} = event.data.object

    if (event.type === 'checkout.session.completed') {
      const metadata = event.data.object.metadata;
      const appointmentId = metadata.appointmentId;
      const amount = event.data.object.amount_total / 100;
      if (appointmentId) {
        await this.prismaService.$transaction(async (tx) => {
          const appointment = await tx.appointment.update({
            where: {
              id: appointmentId,
            },
            data: {
              status: 'CONFIRMED',
              paymentStatus: 'COMPLETED',
            },
          });

          const payment = await tx.payments.create({
            data: {
              appointmentId,
              status: 'COMPLETED',
              amount,
              paymentDetails: {
                type: 'CARD',
                appointmentId,
                doctorId: appointment.doctorId,
                paymentMethod: 'Stripe',
              },
              transactionId: event.data.object.id,
            },
          });

          return payment;
        });
      }
    }

    return event;
  }
}
