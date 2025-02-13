import { z } from 'zod';

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
