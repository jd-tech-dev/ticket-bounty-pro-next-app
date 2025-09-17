import prisma from '@/lib/prisma';

export const verifyAllTicketsExist = async (
  ticketIds: string[]
): Promise<boolean> => {
  if (ticketIds.length === 0) return false;

  const count = await prisma.ticket.count({
    where: {
      id: { in: ticketIds },
    },
  });

  return count === ticketIds.length;
};
