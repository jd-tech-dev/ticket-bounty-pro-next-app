import { ReactElement } from 'react';

export type NavItem = {
  separator?: boolean;
  title: string;
  icon: ReactElement;
  href: string;
};
