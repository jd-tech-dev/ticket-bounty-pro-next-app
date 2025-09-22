import { ReactNode } from 'react';
import { Separator } from './ui/separator';

type HeadingProps = {
  title: string;
  description?: string;
  tabs?: ReactNode;
  actions?: ReactNode;
};

const Heading = ({ title, description, tabs, actions }: HeadingProps) => {
  return (
    <>
      {tabs}
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex gap-x-2">{actions}</div>
      </div>
      <Separator />
    </>
  );
};

export { Heading };
