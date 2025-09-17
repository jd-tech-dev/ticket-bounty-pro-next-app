export const homePath = () => '/';
export const ticketsPath = () => '/tickets';
export const ticketPath = (ticketId: string) => `/tickets/${ticketId}`;
export const ticketEditPath = (ticketId: string) =>
  `${ticketPath(ticketId)}/edit`;

export const pricingPath = () => '/pricing';

export const signUpPath = () => '/sign-up';
export const signInPath = () => '/sign-in';

export const emailVerificationPath = () => '/email-verification';
export const emailInvitationPath = () => '/email-invitation';

export const passwordForgotPath = () => '/password-forgot';
export const passwordResetPath = () => '/password-reset';

export const accountProfilePath = () => '/account/profile';
export const accountPasswordPath = () => '/account/password';

export const onboardingPath = () => '/onboarding';
export const selectActiveOrganizationPath = () =>
  `${onboardingPath()}/select-active-organization`;
export const organizationsPath = () => '/organization';
export const organizationCreatePath = () => '/organization/create';
export const ticketsByOrganizationPath = () => '/tickets/organization';

export const membershipsPath = (organizationId: string) =>
  `${organizationsPath()}/${organizationId}/memberships`;

export const invitationsPath = (organizationId: string) =>
  `/organization/${organizationId}/invitations`;

export const credentialsPath = (organizationId: string) =>
  `/organization/${organizationId}/credentials`;

export const subscriptionPath = (organizationId: string) =>
  `/organization/${organizationId}/subscription`;

export const attachmentDownloadPath = (attachmentId: string) =>
  `/api/aws/s3/attachments/${attachmentId}`;
