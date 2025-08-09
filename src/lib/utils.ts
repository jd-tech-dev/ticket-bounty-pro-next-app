import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseEnvStringToNumber = (configString: string | undefined) => {
  if (!configString) return null;
  const int = parseInt(configString);

  if (Number.isNaN(int)) {
    return null;
  } else return int;
};
