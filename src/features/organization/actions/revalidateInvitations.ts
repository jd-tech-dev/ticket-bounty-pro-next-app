'use server';

import { revalidatePath } from 'next/cache';
import { invitationsPath } from '@/paths';

export const revalidateInvitations = async (organizationId: string) => {
  revalidatePath(invitationsPath(organizationId));
};
