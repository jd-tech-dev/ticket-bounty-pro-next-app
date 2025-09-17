'use server';

import { revalidatePath } from 'next/cache';
import { toActionState } from '@/components/form/utils/to-action-state';
import { MembershipRole } from '@/generated/prisma';
import prisma from '@/lib/prisma';
import { membershipsPath } from '@/paths';
import { getAdminOrRedirect } from '../queries/get-admin-or-redirect';
import { getMemberships } from '../queries/get-memberships';

export const updateMembershipRole = async ({
  userId,
  organizationId,
  membershipRole,
}: {
  userId: string;
  organizationId: string;
  membershipRole: MembershipRole;
}) => {
  await getAdminOrRedirect(organizationId);

  const memberships = await getMemberships(organizationId);

  const targetMembership = (memberships ?? []).find(
    (membership) => membership.userId === userId
  );

  if (!targetMembership) {
    return toActionState('ERROR', 'Membership not found');
  }

  const adminMemberships = (memberships ?? []).filter(
    (membership) => membership.membershipRole === 'ADMIN'
  );

  const removesAdmin = targetMembership.membershipRole === 'ADMIN';
  const isLastAdmin = adminMemberships.length <= 1;

  if (removesAdmin && isLastAdmin) {
    return toActionState(
      'ERROR',
      'You cannot delete the last admin of an organization'
    );
  }

  await prisma.membership.update({
    where: {
      membershipId: {
        userId,
        organizationId,
      },
    },
    data: {
      membershipRole,
    },
  });

  revalidatePath(membershipsPath(organizationId));

  return toActionState('SUCCESS', 'The role has been updated');
};
