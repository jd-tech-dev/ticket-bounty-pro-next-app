'use server';

import { redirect } from 'next/navigation';
import * as z from 'zod/v4';
import { setCookieByKey } from '@/actions/cookies';
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';
import prisma from '@/lib/prisma';
import { signInPath } from '@/paths';
import { hashToken } from '@/utils/crypto';
import { hashPassword } from '../utils/hash-and-verify';

const passwordResetSchema = z
  .object({
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

export const passwordReset = async (
  tokenId: string,
  _actionState: ActionState,
  formData: FormData
) => {
  try {
    const { password } = passwordResetSchema.parse(
      Object.fromEntries(formData)
    );

    const passwordValue = password as string;

    const tokenHash = hashToken(tokenId);
    const passwordResetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (passwordResetToken) {
      await prisma.passwordResetToken.delete({
        where: { tokenHash },
      });
    }

    if (
      !passwordResetToken ||
      Date.now() > passwordResetToken.expiresAt.getTime()
    ) {
      return toActionState(
        'ERROR',
        'Expired or invalid verification token',
        formData
      );
    }

    await prisma.session.deleteMany({
      where: {
        userId: passwordResetToken.userId,
      },
    });

    const passwordHash = await hashPassword(passwordValue);

    await prisma.user.update({
      where: {
        id: passwordResetToken.userId,
      },
      data: {
        passwordHash,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  await setCookieByKey('toast', 'Successfully reset password');
  redirect(signInPath());
};
