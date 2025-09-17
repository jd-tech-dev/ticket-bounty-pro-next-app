import { Comment } from '@/generated/prisma';
import prisma from '@/lib/prisma';
import { findTicketIdsFromText } from '@/utils/find-ids-from-text';

export const disconnectReferencedTicketsViaComment = async (
  comment: Comment
) => {
  const ticketId = comment.ticketId;
  const ticketIds = findTicketIdsFromText('tickets', comment.content);

  if (!ticketIds.length) return;

  const comments = await prisma.comment.findMany({
    where: {
      ticketId: comment.ticketId,
      id: {
        not: comment.id,
      },
    },
  });

  const allOtherContent = comments.map((comment) => comment.content).join(' ');

  const allOtherTicketsIds = findTicketIdsFromText('tickets', allOtherContent);

  const ticketIdsToRemove = ticketIds.filter(
    (ticketId) => !allOtherTicketsIds.includes(ticketId)
  );

  await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      referencedTickets: {
        disconnect: ticketIdsToRemove.map((id) => ({
          id,
        })),
      },
    },
  });
};
