

import { z } from "zod";

 const prescriptionSchema = z.object({
  appointmentId: z.string().min(1, "Appointment ID is required"),
  instruction: z.string().min(1, "Instruction is required"),
});

export type prescriptionDto = z.infer<typeof prescriptionSchema>;
export { prescriptionSchema };