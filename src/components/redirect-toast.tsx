'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { consumeCookiedByKey } from '@/actions/cookies';

const RedirectToast = () => {
  const pathName = usePathname();

  useEffect(() => {
    const showCookieToast = async () => {
      const message = await consumeCookiedByKey('toast');

      if (message) {
        toast.success(message);
      }
    };

    showCookieToast();
  }, [pathName]);

  return null;
};

export { RedirectToast };
