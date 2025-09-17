import { useState } from 'react';
import zxcvbn from 'zxcvbn';

const PASSWORD_STRENGTH = {
  MIN: 0,
  MAX: 4,
  WEAK_THRESHOLD: 3,
} as const;

type PasswordStrengthHook = {
  password: string;
  strength: number;
  isWeakPassword: boolean;
  setPassword: (value: string) => void;
};

const usePasswordStrength = (): PasswordStrengthHook => {
  const [password, setPassword] = useState<string>('');

  const calculateStrength = (pwd: string) => {
    return pwd ? zxcvbn(pwd).score : 0;
  };

  const strength = calculateStrength(password);
  const isWeakPassword = strength < PASSWORD_STRENGTH.WEAK_THRESHOLD;

  return {
    password,
    strength,
    isWeakPassword,
    setPassword,
  };
};

export { usePasswordStrength };
