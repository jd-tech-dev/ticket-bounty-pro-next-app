import { format } from 'date-fns';
import { LucideBan, LucideCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getMemberships } from '../queries/get-memberships';
import { MembershipDeleteButton } from './membership-delete-button';
import { MembershipMoreMenu } from './membership-more-menu';
import { PermissionToggleDropdown } from './permission-toggle-dropdown.tsx';

type MembershipListProps = {
  organizationId: string;
  currentUserId: string;
};

const MembershipList = async ({
  organizationId,
  currentUserId,
}: MembershipListProps) => {
  const memberships = await getMemberships(organizationId);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Joined At</TableHead>
          <TableHead>Verified Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Can Delete Ticket?</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {memberships.map((membership) => {
          const membershipMoreMenu = (
            <MembershipMoreMenu
              userId={membership.userId}
              organizationId={membership.organizationId}
              membershipRole={membership.membershipRole}
            />
          );

          const deleteButton = (
            <MembershipDeleteButton
              organizationId={membership.organizationId}
              userId={membership.userId}
            />
          );

          const buttons = (
            <>
              {membershipMoreMenu}
              {deleteButton}
            </>
          );

          return (
            <TableRow key={membership.userId}>
              <TableCell>
                {membership.userId === currentUserId ? (
                  <>
                    <span>{membership.user.username} </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="secondary">(you)</Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-semibold">That&apos;s you!</p>
                      </TooltipContent>
                    </Tooltip>
                  </>
                ) : (
                  membership.user.username
                )}
              </TableCell>
              <TableCell>{membership.user.email}</TableCell>
              <TableCell>
                {format(membership.joinedAt, 'yyyy-MM-dd, HH:mm')}
              </TableCell>
              <TableCell>
                {membership.user.emailVerified ? (
                  <LucideCheck />
                ) : (
                  <LucideBan />
                )}
              </TableCell>
              <TableCell>{membership.membershipRole}</TableCell>
              <TableCell>
                <PermissionToggleDropdown
                  userId={membership.userId}
                  organizationId={membership.organizationId}
                  permissionKey="canDeleteTicket"
                  permissionValue={membership.canDeleteTicket}
                />
              </TableCell>
              <TableCell className="flex justify-end gap-x-2">
                {buttons}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export { MembershipList };
