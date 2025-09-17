'use client';

import { LucideTrash } from 'lucide-react';
import { cloneElement, ReactElement, useActionState, useState } from 'react';
import { toast } from 'sonner';
import { Form } from '@/components/form/form';
import { SubmitButton } from '@/components/form/submit-button';
import {
  ActionState,
  EMPTY_ACTION_STATE,
} from '@/components/form/utils/to-action-state';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TicketStatus } from '@/generated/prisma';
import { deleteTicket } from '../actions/delete-ticket';
import { updateTicketStatus } from '../actions/update-ticket-status';
import { TICKET_STATUS_LABELS } from '../constants';
import { TicketWithMetadata } from '../types';

type TicketMoreMenuProps = {
  ticket: TicketWithMetadata;
  trigger: ReactElement<{ onClick?: () => void }>;
};

const TicketMoreMenu = ({ ticket, trigger }: TicketMoreMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuTrigger = cloneElement(trigger, {
    onClick: () => setMenuOpen((state) => !state),
  });

  const DeleteButton = ({
    setMenuOpen,
    action,
  }: {
    setMenuOpen: (input: boolean) => void;
    action: () => Promise<ActionState>;
  }) => {
    const [open, setOpen] = useState(false);

    const [actionState, formAction] = useActionState(
      action,
      EMPTY_ACTION_STATE
    );

    const handleOpen = (status: boolean): void => {
      setOpen(status);
      requestAnimationFrame(() => {
        setMenuOpen(status);
      });
    };

    return (
      <>
        <button
          className="w-full px-2 py-1 rounded-md hover:bg-accent"
          onClick={() => {
            handleOpen(true);
          }}
          disabled={!ticket.permissions.canDeleteTicket}
        >
          <div className="flex items-center">
            <LucideTrash className="mr-2 size-4 text-destructive" />
            <span className="text-sm">Delete</span>
          </div>
        </button>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this ticket? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  handleOpen(false);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handleOpen(false);
                }}
                asChild
              >
                <Form
                  action={formAction}
                  actionState={actionState}
                  onSuccess={() => {
                    handleOpen(false);
                  }}
                >
                  <SubmitButton label="Confirm" />
                </Form>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  };

  const handleUpdateTicketStatus = async (value: string) => {
    const promise = updateTicketStatus(ticket.id, value as TicketStatus);
    toast.promise(promise, { loading: 'Updating status...' });
    const result = await promise;
    if (result.status === 'ERROR') {
      toast.error(result.message);
    } else if (result.status === 'SUCCESS') {
      toast.success(result.message);
    }
  };

  const ticketStatusRadioGroupItems = (
    <DropdownMenuRadioGroup
      value={ticket.status}
      onValueChange={handleUpdateTicketStatus}
    >
      {(Object.keys(TICKET_STATUS_LABELS) as Array<TicketStatus>).map((key) => (
        <DropdownMenuRadioItem key={key} value={key}>
          {TICKET_STATUS_LABELS[key]}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  );

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>{menuTrigger}</DropdownMenuTrigger>
        <DropdownMenuContent className="w-32" side="right">
          {ticketStatusRadioGroupItems}
          <DropdownMenuSeparator />
          <DeleteButton
            setMenuOpen={setMenuOpen}
            action={deleteTicket.bind(null, ticket.id)}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export { TicketMoreMenu };
