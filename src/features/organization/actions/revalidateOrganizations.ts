'use server';

import { revalidatePath } from 'next/cache';
import { organizationsPath } from '@/paths';

export const revalidateOrganizations = async () => {
  revalidatePath(organizationsPath());
};
