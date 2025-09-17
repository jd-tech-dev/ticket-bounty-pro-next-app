'use server';

import { toActionState } from '@/components/form/utils/to-action-state';
import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';
import prisma from '@/lib/prisma';
import { getMemberships } from '../queries/get-memberships';

export const deleteMembership = async ({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) => {
  const { user } = await getAuthOrRedirect();

  const memberships = await getMemberships(organizationId);

  const isLastMembership = (memberships ?? []).length <= 1;

  if (isLastMembership) {
    return toActionState(
      'ERROR',
      'You cannot delete the last membership of an organization'
    );
  }

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

  const myMembership = (memberships ?? []).find(
    (membership) => membership.userId === user?.id
  );

  const isMyself = user.id === userId;
  const isAdmin = myMembership?.membershipRole === 'ADMIN';

  if (!isAdmin && !isMyself) {
    return toActionState(
      'ERROR',
      'You can only delete memberships as an admin'
    );
  }

  await prisma.membership.delete({
    where: {
      membershipId: {
        userId,
        organizationId,
      },
    },
  });

  return toActionState(
    'SUCCESS',
    isMyself
      ? 'You have left the organization'
      : 'The membership has been deleted'
  );
};
