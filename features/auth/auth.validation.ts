import * as z from 'zod';

export const RegisterSchema = z.object({
  name: z.string().trim().min(1, { error: 'Name is required' }),

  username: z
    .string()
    .trim()
    .min(1, { error: 'Username is required' })
    .regex(/^[a-zA-Z0-9\-._@+]+$/, {
      error: 'Username contains invalid characters',
    }),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: 'Invalid email address' })),

  password: z
    .string()
    .min(6, { error: 'Password must be at least 6 characters' })
    .regex(/[A-Z]/, { error: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { error: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { error: 'Password must contain at least one digit' })
    .regex(/[^a-zA-Z0-9]/, { error: 'Password must contain at least one special character' }),

  phone: z
    .string()
    .trim()
    .regex(/^(\+977)?[9][6-9]\d{8}$/, {
      message: 'Invalid Nepali mobile number format',
    }),
});

export const LoginSchema = z.object({
  usernameOrEmail: z.string().trim().min(1, { error: 'Username or Email is required' }),

  password: z.string().min(1, { error: 'Password is required' }),
});

export type RegisterFormData = z.infer<typeof RegisterSchema>;
export type LoginFormData = z.infer<typeof LoginSchema>;
