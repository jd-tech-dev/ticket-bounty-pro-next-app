import { Suspense } from 'react';
import { Heading } from '@/components/heading';
import { Spinner } from '@/components/spinner';
import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';
import { InvitationCreateButton } from '@/features/invitation/components/invitation-create-button';
import { MembershipList } from '@/features/membership/components/membership-list';
import { OrganizationBreadcrumbs } from '../_navigation/breadcrumbs';

type MembershipsPageProps = {
  params: Promise<{ organizationId: string }>;
};

const MembershipsPage = async ({ params }: MembershipsPageProps) => {
  const { organizationId } = await params;
  const { user } = await getAuthOrRedirect();

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Memberships"
        description="Manage members in your organization"
        tabs={<OrganizationBreadcrumbs />}
        actions={<InvitationCreateButton organizationId={organizationId} />}
      />

      <Suspense fallback={<Spinner />}>
        <MembershipList
          organizationId={organizationId}
          currentUserId={user.id}
        />
      </Suspense>
    </div>
  );
};

export default MembershipsPage;
