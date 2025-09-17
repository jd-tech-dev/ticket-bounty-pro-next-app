'use server';

import { revalidatePath } from 'next/cache';
import { membershipsPath } from '@/paths';

export const revalidateMemberships = async (organizationId: string) => {
  revalidatePath(membershipsPath(organizationId));
};
