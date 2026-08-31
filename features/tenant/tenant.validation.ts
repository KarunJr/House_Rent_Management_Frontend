import * as z from 'zod';

export const AddTenantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: 'Tenant name is required' })
    .max(100, { error: 'Tenant name is too long' }),
  phone: z
    .string()
    .trim()
    .regex(/^(\+977)?[9][6-9]\d{8}$/, {
      error: 'Invalid Nepali mobile number format',
    }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .optional()
    .or(z.literal(''))
    .transform((value) => value?.trim() ?? '')
    .refine((value) => value === '' || z.email().safeParse(value).success, {
      error: 'Invalid email address',
    }),
});

export type AddTenantFormInput = z.input<typeof AddTenantSchema>;
export type AddTenantFormData = z.output<typeof AddTenantSchema>;
