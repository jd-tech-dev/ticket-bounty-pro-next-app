import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /*This makes this dynamically rendered, keeping it static would require middleware usage
    Creating protected routes using the layout is also not the safest way because a malicous
    user could still access pages with some headers tweaking. So having this check in all 
    individual pages would be safer. However, the most important thing is to add this check 
    to server actions which makes read/write operations not possible for unauthorized user */
  await getAuthOrRedirect();

  return <>{children}</>;
}
