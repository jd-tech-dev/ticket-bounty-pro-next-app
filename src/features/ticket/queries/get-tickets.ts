import { getAuth } from '@/features/auth/queries/get-auth';
import { isOwner } from '@/features/auth/utils/is-owner';
import prisma from '@/lib/prisma';
import { ParsedSearchParams } from '../search-params';

export const getTickets = async (
  userId: string | undefined,
  searchParams: ParsedSearchParams
) => {
  /* When userId is undefined, Prisma treats it as if no filter was 
  applied and returns everyting. Usually a fast failing would be added
  like an empty return ([]) when userId is undefined. The way we are
  using this function, we want the return of all options, so I added 
  the explicit condition to the query. Title filtering acts the same 
  but it should always be present.*/
  const { user } = await getAuth();

  const where = {
    title: {
      contains: searchParams.search,
      mode: 'insensitive' as const,
    },

    ...(userId && {
      userId,
    }),
  };

  const skip = searchParams.page * searchParams.size;
  const take = searchParams.size;

  const [tickets, count] = await prisma.$transaction([
    prisma.ticket.findMany({
      where,
      skip,
      take,
      orderBy: {
        [searchParams.sortKey]: searchParams.sortValue,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    }),
    prisma.ticket.count({
      where,
    }),
  ]);

  // follows naming convention for this kind of return
  return {
    list: tickets.map((ticket) => ({
      ...ticket,
      isOwner: isOwner(user, ticket),
    })),
    metadata: {
      count,
      hasNextPage: count > skip + take,
    },
  };
};
