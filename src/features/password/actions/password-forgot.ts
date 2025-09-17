'use server';

import * as z from 'zod/v4';
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';
import { inngest } from '@/lib/inngest';
import prisma from '@/lib/prisma';
import { emailFragment } from '@/utils/schemaFragments';

const passwordForgotSchema = z.object({
  ...emailFragment(),
});

export const passwordForgot = async (
  _actionState: ActionState,
  formData: FormData
) => {
  try {
    const { email } = passwordForgotSchema.parse(Object.fromEntries(formData));

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return toActionState('SUCCESS', 'Check your email for a reset link');
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
