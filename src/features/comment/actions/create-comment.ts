'use server';

import { revalidatePath } from 'next/cache';
import * as z from 'zod/v4';
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';
import { AttachmentSubjectDTO } from '@/features/attachmets/dto/attachment-subject-dto';
import { filesSchema } from '@/features/attachmets/schema/files';
import * as attachmentService from '@/features/attachmets/service';
import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';
import * as ticketData from '@/features/ticket/data';
import { ticketPath } from '@/paths';
import { findTicketIdsFromText } from '@/utils/find-ids-from-text';
import * as commentData from '../data';
import { CommentWithMetadata } from '../types';

const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, {
      message: 'Comment must be at least 1 character long',
      abort: true,
    })
    .max(1024, {
      message: 'Comment cannot exceed 1024 characters',
      abort: true,
    })
    .refine(
      async (value) => {
        const ticketIds = findTicketIdsFromText('tickets', value);
        return ticketIds.length
          ? await ticketData.verifyAllTicketsExist(ticketIds)
          : true;
      },
      {
        message: 'Referenced invalid or non-existent ticket(s)',
        path: ['content'],
      }
    ),
  files: filesSchema,
});

export const createComment = async (
  ticketId: string,
  _actionState: ActionState,
  formData: FormData
): Promise<ActionState<CommentWithMetadata | undefined>> => {
  const { user } = await getAuthOrRedirect();

  let comment;
  let attachments;

  try {
    const { content, files } = await createCommentSchema.parseAsync({
      content: formData.get('content'),
      files: formData.getAll('files'),
    });

    comment = await commentData.createComment({
      userId: user.id,
      ticketId,
      content,
      options: {
        includeUser: true,
        includeTicket: true,
      },
    });

    const subject = AttachmentSubjectDTO.fromComment(comment);

    if (!subject) {
      return toActionState('ERROR', 'Comment not created');
    }

    attachments = await attachmentService.createAttachments({
      subject: subject,
      entity: 'COMMENT',
      entityId: comment.id,
      files,
    });

    await ticketData.connectReferencedTickets(
      ticketId,
      findTicketIdsFromText('tickets', content)
    );
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }
  revalidatePath(ticketPath(ticketId));

  return toActionState('SUCCESS', 'Comment created', undefined, {
    ...comment,
    attachments,
    isOwner: true,
  });
};
