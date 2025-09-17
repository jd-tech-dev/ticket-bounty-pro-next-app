'use client';

import { LucideLoaderCircle, LucideLogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useConfirmDialog } from '@/components/confirm-dialog';
import { ActionState } from '@/components/form/utils/to-action-state';
import { Button } from '@/components/ui/button';
import { deleteMembership } from '../actions/delete-membership';
import { revalidateMemberships } from '../actions/revalidate-memberships';

type MembershipDeleteButtonProps = {
  userId: string;
  organizationId: string;
};

const MembershipDeleteButton = ({
  userId,
  organizationId,
}: MembershipDeleteButtonProps) => {
  const [status, setStatus] = useState<ActionState['status']>();
  useEffect(() => {
    if (status === 'SUCCESS') {
      const handleSuccess = async () => {
        await revalidateMemberships(organizationId);
      };
      handleSuccess();
      setStatus(undefined);
    }
  }, [status, organizationId]);

  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteMembership.bind(null, {
      userId,
      organizationId,
    }),
    trigger: (isLoading) =>
      isLoading ? (
        <Button variant="destructive" size="icon">
          <LucideLoaderCircle className="size-4 animate-spin" />
        </Button>
      ) : (
        <Button variant="destructive" size="icon">
          <LucideLogOut className="size-4" />
        </Button>
      ),
    onSuccess: (result) => {
      if (result.status === 'SUCCESS') {
        setStatus('SUCCESS');
      }
    },
  });

  return (
    <>
      {deleteDialog}
      {deleteButton}
    </>
  );
};

export { MembershipDeleteButton };
