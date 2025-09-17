import prisma from '@/lib/prisma';

type DeleteAttachmentsArgs = {
  ids: string[];
};

export const deleteAttachments = async ({ ids }: DeleteAttachmentsArgs) => {
  await prisma.attachment.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};
