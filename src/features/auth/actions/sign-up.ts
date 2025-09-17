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
import { inngest } from '@/lib/inngest';
import { createSession } from '@/lib/oslo';
import prisma from '@/lib/prisma';
import { ticketsPath } from '@/paths';
import { generateRandomToken } from '@/utils/crypto';
import {
  confirmPasswordFragment,
  emailFragment,
  passwordFragment,
  usernameFragment,
} from '@/utils/schemaFragments';
import { setSessionCookie } from '../utils/session-cookie';

const signUpSchema = z
  .object({
    ...usernameFragment(),
    ...emailFragment(),
    ...passwordFragment(),
    ...confirmPasswordFragment(),
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
    ) as {
      username: string;
      email: string;
      password: string;
    };

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username: username,
        email: email,
        passwordHash,
      },
    });

    const invitations = await prisma.invitation.findMany({
      where: {
        email,
        status: 'ACCEPTED_WITHOUT_ACCOUNT',
      },
    });

    await prisma.$transaction([
      prisma.invitation.deleteMany({
        where: {
          email,
          status: 'ACCEPTED_WITHOUT_ACCOUNT',
        },
      }),
      prisma.membership.createMany({
        data: invitations.map((invitation) => ({
          organizationId: invitation.organizationId,
          userId: user.id,
          membershipRole: 'MEMBER',
          isActive: false,
        })),
      }),
    ]);

    await inngest.send({
      name: 'app/auth.sign-up',
      data: {
        userId: user.id,
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
