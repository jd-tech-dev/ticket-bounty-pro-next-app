'use client';

import { LucideLoaderCircle, LucideTrash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useConfirmDialog } from '@/components/confirm-dialog';
import { ActionState } from '@/components/form/utils/to-action-state';
import { Button } from '@/components/ui/button';
import { deleteAttachment } from '../actions/delete-attachment';
import { revalidateTicket } from '../actions/revalidate-ticket';

type AttachmentDeleteButtonProps = {
  id: string;
  onDeleteAttachment?: (id: string) => void;
};

const AttachmentDeleteButton = ({
  id,
  onDeleteAttachment,
}: AttachmentDeleteButtonProps) => {
  const [status, setStatus] = useState<ActionState['status']>();
  useEffect(() => {
    if (status === 'SUCCESS') {
      const handleSuccess = async () => {
        await revalidateTicket(id);
      };
      console.log('AttachmentDeleteButton - call handleSuccess()');
      handleSuccess();
      setStatus(undefined);
    }
  }, [status, id]);
  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteAttachment.bind(null, id),
    trigger: (isLoading) =>
      isLoading ? (
        <Button variant="ghost" size="xs">
          <LucideLoaderCircle className="size-4 animate-spin" />
        </Button>
      ) : (
        <Button variant="ghost" size="xs">
          <LucideTrash className="size-4" />
        </Button>
      ),
    onSuccess: (result) => {
      if (result.status === 'SUCCESS') {
        console.log('AttachmentDeleteButton - call onDeleteAttachment');
        onDeleteAttachment?.(id);
        console.log('AttachmentDeleteButton - setStatus(SUCCESS)');
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

export { AttachmentDeleteButton };
