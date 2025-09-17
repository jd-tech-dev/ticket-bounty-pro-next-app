'use client';

import { useActionState } from 'react';
import { FieldError } from '@/components/form/field-error';
import { Form } from '@/components/form/form';
import { SubmitButton } from '@/components/form/submit-button';
import { EMPTY_ACTION_STATE } from '@/components/form/utils/to-action-state';
import { Input } from '@/components/ui/input';
import { passwordReset } from '../actions/password-reset';
import { usePasswordStrength } from '../hooks/use-password-strength';
import PasswordStrength from './password-strength';

type PasswordResetFormProps = {
  tokenId: string;
};

const PasswordResetForm = ({ tokenId }: PasswordResetFormProps) => {
  const [actionState, action] = useActionState(
    passwordReset.bind(null, tokenId),
    EMPTY_ACTION_STATE
  );

  const { password, strength, setPassword, isWeakPassword } =
    usePasswordStrength();

  return (
    <Form action={action} actionState={actionState}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordStrength strength={strength} />
          <FieldError actionState={actionState} name="password" />
        </div>

        <div className="space-y-2">
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            defaultValue={actionState.payload?.get('confirmPassword') as string}
          />
          <FieldError actionState={actionState} name="confirmPassword" />
        </div>

        <SubmitButton label="Reset Password" disabled={isWeakPassword} />
      </div>
    </Form>
  );
};

export { PasswordResetForm };
