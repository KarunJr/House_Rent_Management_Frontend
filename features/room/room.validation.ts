import * as z from 'zod';

export const RoomSchema = z.object({
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
  status: z.enum(['AVAILABLE', 'MAINTENANCE', 'OCCUPIED']),
});

export type RoomFormInput = z.input<typeof RoomSchema>;
export type RoomFormData = z.output<typeof RoomSchema>;

// Kept as aliases so the Add Room route remains easy to read.
export const AddRoomSchema = RoomSchema;
export type AddRoomFormInput = RoomFormInput;
export type AddRoomFormData = RoomFormData;
