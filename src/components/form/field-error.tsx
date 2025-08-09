import { LucideTriangleAlert } from 'lucide-react';
import { ActionState } from './utils/to-action-state';

type FieldErrorProps = {
  actionState: ActionState;
  name: string;
};

const FieldError = ({ actionState, name }: FieldErrorProps) => {
  if (!actionState.fieldErrors?.[name]) {
    return null;
  }

  return (
    <div role="alert" aria-live="polite" className="flex flex-col gap-1">
      {actionState.fieldErrors[name].map((error: string) => (
        <div key={crypto.randomUUID()} className="flex items-center gap-1">
          <LucideTriangleAlert className="size-4 shrink-0 text-red-500" />
          <span className="text-xs text-red-500">{error}</span>
        </div>
      ))}
    </div>
  );
};

export { FieldError };
