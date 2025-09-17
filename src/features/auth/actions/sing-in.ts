'use server';

import { redirect } from 'next/navigation';
import * as z from 'zod/v4';
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';
import { verifyPasswordHash } from '@/features/password/utils/hash-and-verify';
import { createSession } from '@/lib/oslo';
import prisma from '@/lib/prisma';
import { ticketsPath } from '@/paths';
import { generateRandomToken } from '@/utils/crypto';
import { emailFragment, passwordFragment } from '@/utils/schemaFragments';
import { setSessionCookie } from '../utils/session-cookie';

const signInSchema = z.object({
  ...emailFragment(),
  ...passwordFragment(),
});

export const signIn = async (_actionState: ActionState, formData: FormData) => {
  try {
    const { email, password } = signInSchema.parse(
      Object.fromEntries(formData)
    );

    const user = await prisma.user.findUnique({
      where: { email },
    });

    const validPassword = await verifyPasswordHash(
      user ? user.passwordHash : '&argon',
      password
    );

    if (!user || !validPassword) {
      return toActionState('ERROR', 'Incorrect email or password', formData);
    }

    const sessionToken = generateRandomToken();
    const session = await createSession(sessionToken, user.id);

    await setSessionCookie(sessionToken, session.expiresAt);
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  redirect(ticketsPath());
};
