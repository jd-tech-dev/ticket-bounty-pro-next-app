import EmailPasswordReset from '@/emails/password/email-password-reset';
import { resend } from '@/lib/resend';

export const sendEmailPasswordReset = async (
  username: string,
  email: string,
  passwowdResetLink: string
) => {
  return await resend.emails.send({
    from: 'TicketBounty <no-reply@resend.dev>',
    to: email,
    subject: 'Password Reset from TicketBounty',
    react: <EmailPasswordReset toName={username} url={passwowdResetLink} />,
  });
};
