'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { cn } from '@/lib/utils';
import { pricingPath, signInPath, signUpPath } from '@/paths';
import { getActivePath } from '@/utils/get-active-paths';
import { navItems } from '../constants';
import { SidebarItem } from './sidebar-item';

const Sidebar = () => {
  const { user, isFetched } = useAuth();
  const [isTransition, setTransition] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const pathName = usePathname();

  const { activeIndex } = getActivePath(
    pathName,
    navItems.map((item) => item.href),
    [signInPath(), signUpPath(), pricingPath()]
  );

  const handleToggle = (open: boolean) => {
    setTransition(true);
    setOpen(open);
    setTimeout(() => setTransition(false), 200);
  };

  if (!user || !isFetched) {
    // Return to avoid layout shift
    return <div className="w-[78px] bg-secondary/20 absolute" />;
  }

  return (
    <nav
      className={cn(
        'animate-sidebar-from-left absolute peer',
        'h-screen border-r pt-24',
        'bg-background/95',
        isTransition && 'duration-200',
        isOpen ? 'md:w-60 w-[78px]' : 'w-[78px]'
      )}
      onMouseEnter={() => handleToggle(true)}
      onMouseLeave={() => handleToggle(false)}
    >
      <div className="px-3 py-2">
        <nav className="space-y-2">
          {navItems.map((navItem, index) => (
            <SidebarItem
              key={navItem.title}
              isOpen={isOpen}
              isActive={activeIndex === index}
              navItem={navItem}
            />
          ))}
        </nav>
      </div>
    </nav>
  );
};

export { Sidebar };
