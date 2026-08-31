import * as z from 'zod';

export const AddRoomSchema = z.object({
  roomName: z
    .string()
    .trim()
    .min(1, { error: 'Room name is required' })
    .max(20, { error: 'Room name is too long' })
    .regex(/^[A-Za-z0-9-]+$/, {
      error: 'Use only letters, numbers, or hyphen',
    }),
  floorId: z.coerce.number().int().positive({ error: 'Select a floor' }),
  baseRentAmount: z.coerce
    .number()
    .positive({ error: 'Base rent must be greater than 0' })
    .max(9999999, { error: 'Base rent is too large' }),
  status: z.enum(['AVAILABLE', 'MAINTENANCE']),
});

export type AddRoomFormInput = z.input<typeof AddRoomSchema>;
export type AddRoomFormData = z.output<typeof AddRoomSchema>;
