import { Geist, Geist_Mono } from 'next/font/google';
import type { Metadata } from 'next';

import '@workspace/ui/globals.css';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'Base de Conhecimento',
  description: 'Base de conhecimento potencializada por IA',
};

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
