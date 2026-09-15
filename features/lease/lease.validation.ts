import * as z from 'zod';

// Use Nepal's business day regardless of the phone's timezone. Dates sent to
// the API remain Gregorian YYYY-MM-DD, including selections made in BS mode.
export const leaseToday = (now = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kathmandu', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const part = (type: string) => parts.find((value) => value.type === type)!.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
};

const leaseDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, {
    error: 'Use date format YYYY-MM-DD',
  })
  .refine(
    (value) => {
      const date = new Date(`${value}T00:00:00Z`);
      return (
        value > '0001-01-01' &&
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
      );
    },
    { error: 'Choose a valid date' },
  );

const selectedId = (message: string) =>
  z
    .guid({ error: message })
    .refine((value) => value !== '00000000-0000-0000-0000-000000000000', { error: message });

export const CreateLeaseSchema = z.object({
  roomId: selectedId('Select a room'),
  tenantId: selectedId('Select a tenant'),
  startDate: leaseDate.refine((value) => value <= leaseToday(), {
    error: 'Start date cannot be in the future',
  }),
  monthlyRent: z.coerce
    .number()
    .positive({ error: 'Monthly rent must be greater than 0' })
    .max(9999999, { error: 'Monthly rent is too large' }),
});

export type CreateLeaseFormInput = z.input<typeof CreateLeaseSchema>;
export type CreateLeaseFormData = z.output<typeof CreateLeaseSchema>;

export const EndLeaseSchema = z.object({
  endDate: leaseDate.refine((value) => value <= leaseToday(), {
    error: 'Move-out date cannot be in the future',
  }),
});

export type EndLeaseFormInput = z.input<typeof EndLeaseSchema>;
export type EndLeaseFormData = z.output<typeof EndLeaseSchema>;
