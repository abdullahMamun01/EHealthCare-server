import { doctorSchema } from 'src/doctor/dto/update-doctor.dto';
import { z } from 'zod';

export const updateDoctorSchema = doctorSchema.partial();

export type doctorUpdateDto = z.infer<typeof updateDoctorSchema>;
