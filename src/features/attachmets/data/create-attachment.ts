import prisma from '@/lib/prisma'; // Ideally this will be needed only in data access layer (here)
import { AttachmentData } from '../types';

type CreateAttachmentArgs = {
  name: string;
  data: AttachmentData;
};

export const createAttachment = async ({
  name,
  data,
}: CreateAttachmentArgs) => {
  const { entity, ticketId, commentId } = data;

  return await prisma.attachment.create({
    data: {
      name,
      entity,
      commentId,
      ticketId,
    },
  });
};
