import { Body, Controller, Post, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
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
    return await this.paymentService.createPayment(body, req.user.patient_id);
  }
}
