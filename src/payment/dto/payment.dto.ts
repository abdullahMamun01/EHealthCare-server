import { appointmentSchema } from 'src/appointment/dto/appointment.dto';
import { z } from 'zod';

const paymentSchema = appointmentSchema.extend({
    amount: z.number()
  })
 
 export type PaymentDto = z.infer<typeof paymentSchema>;
export { paymentSchema };
