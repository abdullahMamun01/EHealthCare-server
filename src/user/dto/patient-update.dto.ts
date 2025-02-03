import { z } from 'zod';


enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

// Zod validation schema
const patientUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  photo: z.string().url().optional(),
  contactNo: z
    .string()
    .min(10, 'Contact number must be at least 10 digits')
    .optional(), 
  address: z.string().optional(),
  gender: z.enum([Gender.MALE, Gender.FEMALE]).optional(), 
  country: z.string().min(1, 'Country is required').optional(), 
});

export type patientUpdateDto = z.infer<typeof patientUpdateSchema>;

export { patientUpdateSchema };
