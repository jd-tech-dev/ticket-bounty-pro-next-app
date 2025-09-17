import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Header } from '@/app/_navigation/header';
import { Sidebar } from '@/app/_navigation/sidebar/components/sidebar';
import { Footer } from '@/components/footer';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ReactQueryProvider } from './_providers/react-query/react-query-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'The Road To Next',
  description: 'My Road to Next app...',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen`}
      >
        <div className="relative h-screen overflow-hidden">
          <NuqsAdapter>
            <ThemeProvider>
              <ReactQueryProvider>
                <TooltipProvider>
                  <Header />
                  <div className="flex h-screen overflow-hidden border-collapse">
                    <Sidebar />
                    <main className="duration-200 pl-[110px] peer-hover:pl-[240px] min-h-screen flex-1 overflow-y-auto overflow-x-hidden py-24 px-8 bg-secondary/20 flex flex-col">
                      {children}
                    </main>
                  </div>
                  <Footer />
                  <Toaster position="top-center" expand />
                </TooltipProvider>
              </ReactQueryProvider>
            </ThemeProvider>
          </NuqsAdapter>
        </div>
      </body>
    </html>
  );
}
