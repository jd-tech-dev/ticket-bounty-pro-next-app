'use client';

import { LucideLoaderCircle, LucideTrash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useConfirmDialog } from '@/components/confirm-dialog';
import { ActionState } from '@/components/form/utils/to-action-state';
import { Button } from '@/components/ui/button';
import { revalidateInvitations } from '@/features/organization/actions/revalidateInvitations';
import { deleteInvitation } from '../actions/delete-invitation';

type InvitationDeleteButtonProps = {
  email: string;
  organizationId: string;
};

const InvitationDeleteButton = ({
  email,
  organizationId,
}: InvitationDeleteButtonProps) => {
  const [status, setStatus] = useState<ActionState['status']>();
  useEffect(() => {
    if (status === 'SUCCESS') {
      const handleSuccess = async () => {
        await revalidateInvitations(organizationId);
      };
      handleSuccess();
      setStatus(undefined);
    }
  }, [status, organizationId]);
  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteInvitation.bind(null, { email, organizationId }),
    trigger: (isLoading) =>
      isLoading ? (
        <Button variant="destructive" size="icon">
          <LucideLoaderCircle className="size-4 animate-spin" />
        </Button>
      ) : (
        <Button variant="destructive" size="icon">
          <LucideTrash className="size-4" />
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

export { InvitationDeleteButton };
