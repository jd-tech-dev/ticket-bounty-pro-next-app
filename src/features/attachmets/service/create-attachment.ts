import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import * as z from 'zod/v4';
import { AttachmentSubjectDTO } from '@/features/attachmets/dto/attachment-subject-dto';
import { AttachmentEntity } from '@/generated/prisma';
import { s3 } from '@/lib/aws';
import * as attachmentData from '../data';
import { AttachmentSubjectSchema } from '../types';
import { generateS3Key } from '../utils/generate-s3-key';

type CreateAttachmentArgs = {
  subject: AttachmentSubjectDTO;
  entity: AttachmentEntity;
  entityId: string;
  files: File[];
};

export const createAttachments = async ({
  subject,
  entity,
  entityId,
  files,
}: CreateAttachmentArgs) => {
  // Track attachments at different stages of processing
  const attachments = []; // Database entries
  const uploadedKeys: string[] = []; // S3 objects
  try {
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const attachment = await attachmentData.createAttachment({
        name: file.name,
        data: AttachmentSubjectSchema.parse({
          entity,
          ticketId: entity === AttachmentEntity.TICKET ? entityId : undefined,
          commentId: entity === AttachmentEntity.COMMENT ? entityId : undefined,
        }),
      });

      attachments.push(attachment);

      const key = generateS3Key({
        organizationId: subject.organizationId,
        entityId,
        entity,
        fileName: file.name,
        attachmentId: attachment.id,
      });

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: file.type,
        })
      );

      uploadedKeys.push(key);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw error;
    }

    // Rollback S3 uploads
    await Promise.all(
      uploadedKeys.map(
        (key) =>
          s3
            .send(
              new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: key,
              })
            )
            .catch(() => null) // Don’t crash during rollback
      )
    );

    // Rollback DB entries
    attachmentData
      .deleteAttachments({
        ids: attachments.map((attachment) => attachment.id),
      })
      .catch(() => null); // Don’t crash during rollback

    throw error;
  }
  return attachments;
};
