import { doctorSchema } from 'src/doctor/dto/update-doctor.dto';
import { z } from 'zod';
// Schema
export const createDoctorSchema = doctorSchema.extend({
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const adminSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  contactNo: z.string().refine(
    (value) => {
      const startsWithCountryCode = /^\+\d{1,3}\s?\d{9,12}$/.test(value);
      return startsWithCountryCode || value.length >= 10;
    },
    {
      message:
        'Contact number must be at least 10 digits or start with a country code',
    },
  ),
});

export type CreateDoctorDto = z.infer<typeof createDoctorSchema>;
export type CreateAdminDto = z.infer<typeof adminSchema>;
