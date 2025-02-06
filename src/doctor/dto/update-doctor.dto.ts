import { z } from 'zod';
const GenderEnum = z.enum(['MALE', 'FEMALE', 'OTHER']);
const AccountStatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']);

const doctorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  gender: GenderEnum.optional(),
  yearsOfExperience: z.union([z.number().int(), z.string()]).refine(
    (value) => {
      if (typeof value === 'number') return true;
      const num = Number(value);
      if (isNaN(num)) return false;
      return num % 1 === 0;
    },
    {
      message: 'Years of experience must be a number',
    },
  ),
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
  workingIn: z.string().min(1, 'Working in is required').optional(),
  biography: z.string().min(1, 'Biography is required').optional(),
  degrees: z.string().min(1, 'Degrees is required').optional(),
  address: z.string().min(1, 'Address is required'),
  country: z.string().min(1, 'Country is required'),
  licenseNo: z.string().min(1, 'License number is required'),
  consultationFee: z.number().int().min(0).optional(),
  status: AccountStatusEnum.default('ACTIVE'),
});

const updateDoctorSchema = doctorSchema.partial();

export type updateDoctorDto = z.infer<typeof updateDoctorSchema>;

export { doctorSchema, updateDoctorSchema };
