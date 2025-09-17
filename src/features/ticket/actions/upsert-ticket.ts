'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import * as z from 'zod/v4';
import { setCookieByKey } from '@/actions/cookies';
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';
import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';
import { isOwner } from '@/features/auth/utils/is-owner';
import prisma from '@/lib/prisma';
import { ticketPath, ticketsPath } from '@/paths';
import { toCent } from '@/utils/currency';

const upsertTicketSchema = z.object({
  title: z
    .string()
    .nonempty({ message: 'Title is required' })
    .trim()
    .min(3, { message: 'Title must be at least 3 characters long' })
    .max(200, { message: 'Title cannot exceed 200 characters' }), // 200 is enough for a title
  content: z
    .string()
    .nonempty({ message: 'Content is required' })
    .trim()
    .min(10, {
      message: 'Content must be at least 10 characters long',
    })
    .max(1024, { message: 'Content cannot exceed 1024 characters' }), // 1024 as per db schema
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Is required'),
  bounty: z.coerce.number().positive(),
});

export const upsertTicket = async (
  id: string | undefined,
  _actionState: ActionState,
  formData: FormData
) => {
  const { user, activeOrganization } = await getAuthOrRedirect();

  try {
    if (id) {
      // Updates have id and are changing data => authorization needed
      const ticket = await prisma.ticket.findUnique({
        where: {
          id,
        },
      });

      if (!ticket || !isOwner(user, ticket)) {
        return toActionState('ERROR', 'Not authorized');
      }
    }

    const data = upsertTicketSchema.parse({
      title: formData.get('title'),
      content: formData.get('content'),
      deadline: formData.get('deadline'),
      bounty: formData.get('bounty'),
    });

    const dbData = {
      ...data,
      userId: user.id,
      bounty: toCent(data.bounty),
    };

    await prisma.ticket.upsert({
      where: {
        id: id || '',
      },
      update: dbData,
      create: { ...dbData, organizationId: activeOrganization!.id },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(ticketsPath());

  if (id) {
    await setCookieByKey('toast', 'Ticket updated');
    redirect(ticketPath(id));
  }

  return toActionState('SUCCESS', 'Ticket created');
};
