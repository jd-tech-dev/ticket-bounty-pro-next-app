import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /* 
  This layout provides an initial authentication check for protected routes.
  Additional security is implemented in all server actions to protect data operations.
  The combination ensures both UI access and data integrity are properly secured.
*/
  await getAuthOrRedirect();
  return <>{children}</>;
}
