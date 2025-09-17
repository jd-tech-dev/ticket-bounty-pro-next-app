'use server';

import { revalidatePath } from 'next/cache';
import { ticketPath } from '@/paths';

export const revalidateTicket = async (ticketId: string) => {
  revalidatePath(ticketPath(ticketId));
};
