import * as z from 'zod/v4';

export const emailFragment = () => ({
  email: z
    .email({
      error: (issue) =>
        issue.input === '' ? 'Required' : 'Invalid email address',
      abort: true,
    })
    .refine(
      (val) => {
        const [localPart, domain] = val.split('@');
        return (
          localPart.length <= 64 && domain.length <= 255 && val.length <= 320
        );
      },
      {
        message: 'Invalid email address',
        path: ['email'],
      }
    ),
});

export const usernameFragment = () => ({
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters long',
    })
    .max(100)
    .refine((value) => !value.includes(' '), {
      message: 'Username cannot contain spaces',
      path: ['username'],
    }),
});

export const passwordFragment = () => ({
  password: z
    .string()
    .nonempty({ message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(100),
});

export const confirmPasswordFragment = () => ({
  confirmPassword: z
    .string()
    .min(6, {
      message: 'ConfirmPassword must be at least 6 characters long',
    })
    .max(100),
});
