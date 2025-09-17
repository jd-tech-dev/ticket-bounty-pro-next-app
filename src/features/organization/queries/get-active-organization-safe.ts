'use server';

import { getAuth } from '@/features/auth/queries/get-auth';
import prisma from '@/lib/prisma';

export const getActiveOrganizationSafe = async () => {
  const { user } = await getAuth();

  if (!user) {
    return null;
  }

  try {
    const activeOrganization = await prisma.organization.findFirst({
      where: {
        memberships: {
          some: {
            userId: user.id,
            isActive: true,
          },
        },
      },
    });
    return { activeOrganization };
  } catch {
    return { error: 'Error when retrieving active organization' };
  }
};
