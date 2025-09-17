import { EventSchemas, Inngest } from 'inngest';
import { AttachmentDeleteEventArgs } from '@/features/attachmets/events/event-attachment-deleted';
import { EmailVerificationEventArgs } from '@/features/auth/events/event-email-verification';
import { InvitationCreateEventArgs } from '@/features/invitation/events/event-invitation-created';
import { OrganizationCreateEventArgs } from '@/features/organization/events/event-organization-created';
import { SendPasswordResetEventArgs } from '@/features/password/events/event-password-reset';

type Events = {
  'app/password.send-password-reset': SendPasswordResetEventArgs;
  'app/auth.sign-up': EmailVerificationEventArgs;
  'app/invitation.created': InvitationCreateEventArgs;
  'app/attachment.deleted': AttachmentDeleteEventArgs;
  'app/organization.created': OrganizationCreateEventArgs;
};

export const inngest = new Inngest({
  id: 'the-road-to-next',
  schemas: new EventSchemas().fromRecord<Events>(),
});
