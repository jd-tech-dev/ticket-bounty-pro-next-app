import { toast, ToastT } from 'sonner';
import { useActionFeedback } from './hooks/use-action-feedback';
import { ActionState } from './utils/to-action-state';

type FormProps<T = unknown> = {
  action: (payload: FormData) => void;
  actionState: ActionState<T>;
  children: React.ReactNode;
  onSuccess?: (actionState: ActionState<T>) => void;
  onError?: (acionState: ActionState) => void;
  toastOptions?: Omit<ToastT, 'id'> | undefined;
};

const Form = <T,>({
  action,
  actionState,
  children,
  onSuccess,
  onError,
  toastOptions,
}: FormProps<T>) => {
  useActionFeedback(actionState, {
    onSuccess: ({ actionState }) => {
      if (actionState.message) toast.success(actionState.message, toastOptions);
      onSuccess?.(actionState);
    },
    onError: ({ actionState }) => {
      if (actionState.message) toast.error(actionState.message, toastOptions);
      onError?.(actionState);
    },
  });
  return (
    <form action={action} className="flex flex-col gap-y-2">
      {children}
    </form>
  );
};

export { Form };
