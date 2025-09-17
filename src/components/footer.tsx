import { LucideLoaderCircle, LucideUserPen } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getAuth } from '@/features/auth/queries/get-auth';
import { getActiveOrganizationSafe } from '@/features/organization/queries/get-active-organization-safe';
import { organizationsPath, selectActiveOrganizationPath } from '@/paths';

const DataContent = async () => {
  const result = await getActiveOrganizationSafe();

  if (!result) return null;

  return (
    <>
      <span className="text-sm text-muted-foreground">
        Active organization:{' '}
        {result.error
          ? 'No Data'
          : result.activeOrganization
            ? result.activeOrganization.name
            : 'Not Selected'}
      </span>
      {!result.error && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              asChild
              variant="outline"
              size="xs"
              aria-label={
                result.activeOrganization
                  ? 'Switch organization'
                  : 'Pick organization'
              }
            >
              <Link
                href={
                  result.activeOrganization
                    ? organizationsPath()
                    : selectActiveOrganizationPath()
                }
              >
                <LucideUserPen className="size-4" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {result.activeOrganization
                ? 'Switch organization'
                : 'Pick organization'}
            </p>
          </TooltipContent>
        </Tooltip>
      )}
    </>
  );
};

const Footer = async () => {
  const { user } = await getAuth();

  if (!user) return null;

  return (
    <footer
      role="contentinfo"
      aria-label="User's active organization status"
      className="supports-backdrop-blur:bg-background/60 bg-background/95 backdrop-blur animate-footer-from-bottom
              border-t
              fixed
              inset-x-0
              bottom-0
              p-2"
    >
      <div className="flex items-center justify-end gap-x-2 max-h-6">
        <Suspense
          fallback={
            <div className="flex items-center gap-x-2">
              <span className="text-sm text-muted-foreground">Loading...</span>
              <LucideLoaderCircle className="size-4 animate-spin" />
            </div>
          }
        >
          <DataContent />
        </Suspense>
      </div>
    </footer>
  );
};

export { Footer };
