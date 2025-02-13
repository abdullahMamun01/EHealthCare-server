import { z } from 'zod';

export const generateTokenSchema = z.object({
  channelName: z.string().min(1, 'Channel name is required'),
  role: z
    .enum(['PUBLISHER', 'SUBSCRIBER'])
    .refine(
      (role) => ['PUBLISHER', 'SUBSCRIBER'].includes(role),
      'Invalid role',
    )
    .optional(),
  uid: z.string().uuid('Invalid UID format'),
  expireTimeInSeconds: z
    .number()
    .min(1, 'Expiration time must be at least 1 second')
    .max(86400, 'Expiration time cannot exceed 24 hours')
    .optional(),
});

export type GenerateTokenDto = z.infer<typeof generateTokenSchema>;
