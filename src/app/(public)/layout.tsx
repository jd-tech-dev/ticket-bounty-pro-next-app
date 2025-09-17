export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="lg:mr-[78px] h-full">{children}</div>;
}
