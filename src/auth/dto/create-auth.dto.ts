import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({
      message: 'Invalid email address',
    })
    .nonempty({ message: 'Email is required' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters')
    .nonempty({ message: 'Password is required' }),
});

const registerSchema = loginSchema.extend({
  name: z.string({ required_error: 'Name is required' }).nonempty(),
  country: z.string({ required_error: 'Country is required' }).nonempty(),

  email: z
    .string({ required_error: 'Email is required' })
    .email({
      message: 'Invalid email address',
    })
    .nonempty(),
  role: z.string().optional(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters')
    .nonempty(),
});

export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;

export { loginSchema, registerSchema };

