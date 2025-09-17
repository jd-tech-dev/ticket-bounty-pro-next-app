'use server';

import * as z from 'zod/v4';
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';
import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';
import { inngest } from '@/lib/inngest';
import prisma from '@/lib/prisma';
import { verifyPasswordHash } from '../utils/hash-and-verify';

const passwordChangeSchema = z.object({
  password: z
    .string()
    .nonempty({ message: 'Password is required' })
    .min(6, {
      message: 'Password must be at least 6 characters long',
    })
    .max(100),
});

export const passwordChange = async (
  _actionState: ActionState,
  formData: FormData
) => {
  const auth = await getAuthOrRedirect();

  try {
    const { password } = passwordChangeSchema.parse({
      password: formData.get('password'),
    });

    const user = await prisma.user.findUnique({
      where: { email: auth.user.email },
    });

    if (!user) {
      return toActionState('ERROR', 'Invalid request', formData);
    }

    const validPassword = await verifyPasswordHash(user.passwordHash, password);

    if (!validPassword) {
      return toActionState('ERROR', 'Incorrect password', formData);
    }

    await inngest.send({
      name: 'app/password.send-password-reset',
      data: { userId: user.id },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  return toActionState('SUCCESS', 'Check your email for a reset link');
};
