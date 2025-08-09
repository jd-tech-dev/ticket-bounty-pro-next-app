'use server';

import { redirect } from 'next/navigation';
import * as z from 'zod/v4';
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';
import { hashPassword } from '@/features/password/utils/hash-and-verify';
import { Prisma } from '@/generated/prisma';
import { createSession } from '@/lib/lucia';
import prisma from '@/lib/prisma';
import { ticketsPath } from '@/paths';
import { generateRandomToken } from '@/utils/crypto';
import { setSessionCookie } from '../utils/session-cookie';

const signUpSchema = z
  .object({
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
    email: z.email('Please enter a valid email address'),
    password: z
      .string()
      .nonempty({ message: 'Password is required' })
      .min(6, {
        message: 'Password must be at least 6 characters long',
      })
      .max(100),
    confirmPassword: z
      .string()
      .min(6, {
        message: 'ConfirmPassword must be at least 6 characters long',
      })
      .max(100),
  })
  .partial()
  .refine(
    (data) => {
      const pwd = data.password;
      const confPwd = data.confirmPassword;
      return pwd === confPwd && pwd !== undefined && confPwd !== undefined;
    },
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  );

export const signUp = async (_actionState: ActionState, formData: FormData) => {
  try {
    const { username, email, password } = signUpSchema.parse(
      Object.fromEntries(formData)
    );

    const passwordHash = await hashPassword(password as string);

    const user = await prisma.user.create({
      data: {
        username: username as string,
        email: email as string,
        passwordHash,
      },
    });

    const sessionToken = generateRandomToken();
    const session = await createSession(sessionToken, user.id);

    await setSessionCookie(sessionToken, session.expiresAt);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return toActionState(
        'ERROR',
        'Either email or username is already in use',
        formData
      );
    }

    return fromErrorToActionState(error, formData);
  }

  redirect(ticketsPath());
};
