import { serve } from 'inngest/next';
import { attachmentDeletedEvent } from '@/features/attachmets/events/event-attachment-deleted';
import { emailVerificationEvent } from '@/features/auth/events/event-email-verification';
import { invitationCreatedEvent } from '@/features/invitation/events/event-invitation-created';
import { organizationCreatedEvent } from '@/features/organization/events/event-organization-created';
import { passwordResetFunction } from '@/features/password/events/event-password-reset';
import { inngest } from '@/lib/inngest';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    passwordResetFunction,
    emailVerificationEvent,
    invitationCreatedEvent,
    attachmentDeletedEvent,
    organizationCreatedEvent,
  ],
});
