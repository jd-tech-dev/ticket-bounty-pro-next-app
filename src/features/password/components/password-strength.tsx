import { CustomProgress } from '@/components/custom-progress';

interface PasswordStrengthProps {
  strength: number;
}

export default function PasswordStrength({ strength }: PasswordStrengthProps) {
  const progress = (strength / 4) * 100;

  const getProgressColor = (value: number) => {
    if (value <= 33) return 'bg-red-500';
    if (value <= 66) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-2">
      <CustomProgress
        value={progress}
        ariaLabel="Password strength indicator"
        className={`h-2 ${getProgressColor(progress)}`}
      />
      <p className="text-sm text-gray-500">
        {strength === 0
          ? 'Enter a password'
          : strength === 1
            ? 'Very weak'
            : strength === 2
              ? 'Weak'
              : strength === 3
                ? 'Strong'
                : 'Very strong'}
      </p>
    </div>
  );
}
