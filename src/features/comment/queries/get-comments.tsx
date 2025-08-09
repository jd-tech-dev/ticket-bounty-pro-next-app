'use server';

import { isOwner } from '@/features/auth/utils/is-owner';
import { getAuth } from '@/features/ticket/queries/get-auth';
import prisma from '@/lib/prisma';

export const getComments = async (
  ticketId: string,
  cursor?: { id: string; createdAt: number }
) => {
  const { user } = await getAuth();

  const where = {
    ticketId,
  };

  const take = 2;

  const result = await prisma.$transaction([
    prisma.comment.findMany({
      where,
      take: take + 1,
      cursor: cursor
        ? { createdAt: new Date(cursor.createdAt), id: cursor?.id }
        : undefined,
      skip: cursor ? 1 : 0,
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    }),
    prisma.comment.count({
      where,
    }),
  ]);

  let comments = result[0];
  const count = result[1];

  const hasNextPage = comments.length > take;

  comments = hasNextPage ? comments.slice(0, -1) : comments;

  const lastComment = comments.at(-1);

  return {
    list: comments.map((comment) => ({
      ...comment,
      isOwner: isOwner(user, comment),
    })),
    metadata: {
      count,
      hasNextPage,
      cursor: lastComment
        ? {
            id: lastComment.id,
            createdAt: lastComment.createdAt.valueOf(),
          }
        : undefined,
    },
  };
};
