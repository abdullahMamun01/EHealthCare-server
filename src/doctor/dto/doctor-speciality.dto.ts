import { z } from 'zod';

const doctorSpecialtiesSchema = z.array(
  z.object({
    specialtiesId: z.string().min(1, 'Specialty ID is required'),
    isDeleted: z.boolean(),
  }),
);

export type DoctorSpecialtiesDto = z.infer<typeof doctorSpecialtiesSchema>;

export { doctorSpecialtiesSchema };
