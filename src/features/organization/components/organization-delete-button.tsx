'use client';

import { LucideLoaderCircle, LucideTrash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useConfirmDialog } from '@/components/confirm-dialog';
import { ActionState } from '@/components/form/utils/to-action-state';
import { Button } from '@/components/ui/button';
import { deleteOrganization } from '../actions/delete-organization';
import { revalidateOrganizations } from '../actions/revalidateOrganizations';

type OrganizationDeleteButtonProps = {
  organizationId: string;
};

const OrganizationDeleteButton = ({
  organizationId,
}: OrganizationDeleteButtonProps) => {
  const [status, setStatus] = useState<ActionState['status']>();
  useEffect(() => {
    if (status === 'SUCCESS') {
      const handleSuccess = async () => {
        await revalidateOrganizations();
      };
      handleSuccess();
      setStatus(undefined);
    }
  }, [status]);
  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteOrganization.bind(null, organizationId),
    trigger: (isPending) => (
      <Button variant="destructive" size="icon">
        {isPending ? (
          <LucideLoaderCircle className="size-4 animate-spin" />
        ) : (
          <LucideTrash className="size-4" />
        )}
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

export { OrganizationDeleteButton };
