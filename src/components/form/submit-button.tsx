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
  disabled?: boolean;
};

/* Handles form submission states with optional external pending control.
  When external pendingAction is present, it takes precedence over the
  internal pendingSubmit sourced from the useFormStatus hook. */

const SubmitButton = ({
  label,
  icon,
  variant = 'default',
  size = 'default',
  pendingAction,
  disabled,
}: SubmitButtonProps) => {
  const { pending: pendingSubmit } = useFormStatus(); // Only tracks submission

  const pending = pendingAction ?? pendingSubmit;

  return (
    <Button
      disabled={disabled || pending}
      type="submit"
      aria-busy={pending}
      aria-label={`${label}${pending ? ' (loading)' : ''}`}
      variant={variant}
      size={size}
    >
      <div className="flex items-center gap-1">
        {pending ? (
          <LucideLoaderCircle
            className={clsx('size-4 animate-spin', label && 'mr-1')}
          />
        ) : (
          <span className={clsx(label && 'mr-1')}>
            {icon &&
              cloneElement(icon, {
                className: 'size-4',
              })}
          </span>
        )}
        {label}
      </div>
    </Button>
  );
};

export { SubmitButton };
