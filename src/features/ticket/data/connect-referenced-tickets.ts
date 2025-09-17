import prisma from '@/lib/prisma';

export const connectReferencedTickets = async (
  ticketId: string,
  ticketIds: string[]
) => {
  await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      referencedTickets: {
        // Prisma automatically takes care of the other side of the relationship
        connect: ticketIds.map((id) => ({
          id,
        })),
      },
    },
  });
};
