'use server';

import { revalidatePath } from 'next/cache';
import * as z from 'zod/v4';
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';
import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';
import { isOwner } from '@/features/auth/utils/is-owner';
import { AttachmentEntity } from '@/generated/prisma';
import { ticketPath } from '@/paths';
import { filesSchema } from '../schema/files';
import * as attachmentService from '../service'; // Smart approach for layer descriptive import

const createAttachmentsSchema = z.object({
  files: filesSchema.refine((files) => files.length !== 0, 'File is required'),
});

type CreateAttachmentsArgs = {
  entityId: string;
  entity: AttachmentEntity;
};

export const createAttachments = async (
  { entityId, entity }: CreateAttachmentsArgs,
  _actionState: ActionState,
  formData: FormData
) => {
  const { user } = await getAuthOrRedirect();

  const subject = await attachmentService.getAttachmentSubject(
    entityId,
    entity
  );

  if (!subject) {
    return toActionState('ERROR', 'Subject not found');
  }

  if (!isOwner(user, subject)) {
    return toActionState('ERROR', 'Not the owner of this subject');
  }

  try {
    const result = createAttachmentsSchema.safeParse({
      files: formData.getAll('files'),
    });

    if (!result.success) {
      return fromErrorToActionState(result.error);
    } else {
      await attachmentService.createAttachments({
        subject,
        entity,
        entityId,
        files: result.data.files,
      });
    }
  } catch {
    return toActionState('ERROR', 'Attachment(s) upload failed');
  }

  revalidatePath(ticketPath(subject.ticketId));

  return toActionState('SUCCESS', 'Attachment(s) uploaded');
};
