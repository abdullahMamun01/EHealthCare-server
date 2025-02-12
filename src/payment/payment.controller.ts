import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Public } from 'src/auth/metadata';
import { ZodValidationPipe } from 'src/others/zodValidationPipe';
import { paymentSchema } from './dto/payment.dto';
import { Role, Roles } from 'src/guard/role/roles.decorator';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @Roles(Role.User)
  @Post()
  async createPayment(
    @Request() req: any,
    @Body(new ZodValidationPipe(paymentSchema)) body: any,
  ) {

    return await this.paymentService.createPayment(
      req.body,
      req.user.patient_id,
    );
  }
}
