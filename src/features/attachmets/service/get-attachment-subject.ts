import { AttachmentEntity } from '@/generated/prisma';
import prisma from '@/lib/prisma';
import { AttachmentSubjectDTO } from '../dto/attachment-subject-dto';

export const getAttachmentSubject = async (
  entityId: string,
  entity: AttachmentEntity
) => {
  switch (entity) {
    case 'TICKET': {
      const ticket = await prisma.ticket.findUnique({
        where: {
          id: entityId,
        },
      });

      return AttachmentSubjectDTO.fromTicket(ticket);
    }
    case 'COMMENT': {
      const comment = await prisma.comment.findUnique({
        where: {
          id: entityId,
        },
        include: {
          ticket: true,
        },
      });

      return AttachmentSubjectDTO.fromComment(comment);
    }
    default:
      return null;
  }
};
