import {
  Controller,
  Headers,
  Post,
  RawBodyRequest,
  Req,
  Request,
} from '@nestjs/common';
import { Public } from 'src/auth/metadata';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Public()
  @Post('webhook')
  async webhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    return this.stripeService.webhook(signature, req);
  }
}
