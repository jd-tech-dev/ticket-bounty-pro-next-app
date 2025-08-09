'use client';

import clsx from 'clsx';
import { LucideLoaderCircle } from 'lucide-react';
import { cloneElement } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '../ui/button';

type SubmitButtonProps = {
  label?: string;
  icon?: React.ReactElement<{ className?: string }>;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  pendingAction?: boolean;
};

/**
 * SubmitButton Component
 *
 * Handles form submission states with optional external pending control.
 * When external pendingAction is present, it takes precedence over the
 * internal pendingSubmit sourced from the useFormStatus hook.
 */

const SubmitButton = ({
  label,
  icon,
  variant = 'default',
  size = 'default',
  pendingAction,
}: SubmitButtonProps) => {
  const { pending: pendingSubmit } = useFormStatus(); // only tracks submission

  const pending = pendingAction ?? pendingSubmit;

  return (
    <Button
      disabled={pending}
      type="submit"
      aria-busy={pending}
      aria-label={`${label}${pending ? ' (loading)' : ''}`}
      variant={variant}
      size={size}
    >
      {pending && (
        <LucideLoaderCircle
          className={clsx('size-4 animate-spin', {
            'mr-0.5': !!label,
          })}
        />
      )}
      {label}
      {pending ? null : icon ? (
        <span
          className={clsx({
            'ml-0.5': !!label,
          })}
        >
          {cloneElement(icon, {
            className: 'size-4',
          })}
        </span>
      ) : null}
    </Button>
  );
};

export { SubmitButton };
