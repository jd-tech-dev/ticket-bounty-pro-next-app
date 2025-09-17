import { AttachmentEntity } from '@/generated/prisma';
import { AttachmentSubjectComment, AttachmentSubjectTicket } from '../types';

export class AttachmentSubjectDTO {
  constructor(
    public readonly entity: AttachmentEntity,
    public readonly entityId: string,
    public readonly organizationId: string,
    public readonly userId: string | null,
    public readonly ticketId: string,
    public readonly commentId: string | null
  ) {}

  static fromTicket(
    ticket: AttachmentSubjectTicket | null
  ): AttachmentSubjectDTO | null {
    if (!ticket) return null;

    return new AttachmentSubjectDTO(
      AttachmentEntity.TICKET,
      ticket.id,
      ticket.organizationId,
      ticket.userId,
      ticket.id,
      null
    );
  }

  static fromComment(
    comment: AttachmentSubjectComment | null
  ): AttachmentSubjectDTO | null {
    if (!comment) return null;

    return new AttachmentSubjectDTO(
      AttachmentEntity.COMMENT,
      comment.id,
      comment.ticket.organizationId,
      comment.userId,
      comment.ticket.id,
      comment.id
    );
  }
}
