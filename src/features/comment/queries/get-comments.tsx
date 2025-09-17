'use server';

import { getAuth } from '@/features/auth/queries/get-auth';
import { isOwner } from '@/features/auth/utils/is-owner';
import prisma from '@/lib/prisma';

const COMMENT_DEFAULT_TAKE_SIZE = 2;

export const getComments = async (
  ticketId: string,
  cursor?: { id: string; createdAt: number }
) => {
  const { user } = await getAuth();

  const where = {
    ticketId,
  };

  const take = COMMENT_DEFAULT_TAKE_SIZE;

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
        attachments: true,
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
