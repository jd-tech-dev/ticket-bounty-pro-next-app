import * as z from 'zod/v4';
import { AttachmentEntity, Prisma } from '@/generated/prisma';

export type AttachmentSubjectTicket = Prisma.TicketGetPayload<{
  select: {
    id: true;
    organizationId: true;
    userId: true;
  };
}>;

export type AttachmentSubjectComment = Prisma.CommentGetPayload<{
  include: {
    ticket: {
      select: {
        id: true;
        organizationId: true;
      };
    };
  };
}>;

export const AttachmentSubjectSchema = z.discriminatedUnion('entity', [
  z.object({
    entity: z.literal(AttachmentEntity.TICKET),
    ticketId: z.string(),
    commentId: z.undefined(),
  }),
  z.object({
    entity: z.literal(AttachmentEntity.COMMENT),
    commentId: z.string(),
    ticketId: z.undefined(),
  }),
]);

export type AttachmentData = z.TypeOf<typeof AttachmentSubjectSchema>;
