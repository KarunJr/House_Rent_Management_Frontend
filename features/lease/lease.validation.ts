import * as z from 'zod';

export const CreateLeaseSchema = z.object({
  roomId: z.coerce.number().int().positive({ error: 'Select a room' }),
  tenantId: z.coerce.number().int().positive({ error: 'Select a tenant' }),
  startDate: z
    .string()
    .trim()
    .min(1, { error: 'Start date is required' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      error: 'Use date format YYYY-MM-DD',
    }),
  monthlyRent: z.coerce
    .number()
    .positive({ error: 'Monthly rent must be greater than 0' })
    .max(9999999, { error: 'Monthly rent is too large' }),
});

export type CreateLeaseFormInput = z.input<typeof CreateLeaseSchema>;
export type CreateLeaseFormData = z.output<typeof CreateLeaseSchema>;
