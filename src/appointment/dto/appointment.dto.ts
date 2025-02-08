import { z } from 'zod';

const AppointmentStatusEnum = z
  .enum(['PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED'])
  .refine(
    (val) => ['PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED'].includes(val),
    {
      message:
        'Invalid Appointment Status. Must be one of: PENDING, CONFIRMED, CANCELED, or COMPLETED.',
    },
  );

const PaymentStatusEnum = z
  .enum(['PENDING', 'COMPLETED', 'CANCELED', 'REFUNDED'])
  .refine(
    (val) => ['PENDING', 'COMPLETED', 'CANCELED', 'REFUNDED'].includes(val),
    {
      message:
        'Invalid Payment Status. Must be one of: PENDING, COMPLETED, CANCELED, or REFUNDED.',
    },
  );

const appointmentSchema = z.object({
  doctorId: z.string().min(1, { message: 'Doctor ID is required' }),
  scheduleId: z.string().min(1, { message: 'Schedule ID is required' }),
  problemDescription: z
    .string()
    .min(1, { message: 'Problem Description is required' })
    .optional(),
});

export type AppointmentDto = z.infer<typeof appointmentSchema>;

export { appointmentSchema };
