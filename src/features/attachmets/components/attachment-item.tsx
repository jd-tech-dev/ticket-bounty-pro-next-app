import { ArrowUpRightFromSquareIcon } from 'lucide-react';
import Link from 'next/link';
import { Attachment } from '@/generated/prisma';
import { attachmentDownloadPath } from '@/paths';

type AttachmentItemProps = {
  attachment: Attachment;
  buttons: React.ReactNode[];
};

const AttachmentItem = ({ attachment, buttons }: AttachmentItemProps) => {
  return (
    <div className="flex justify-between items-center">
      <Link
        className="flex gap-x-2 items-center text-sm truncate"
        href={attachmentDownloadPath(attachment.id)}
      >
        <ArrowUpRightFromSquareIcon className="size-4" />
        {attachment.name}
      </Link>
      {buttons}
    </div>
  );
};

export { AttachmentItem };
