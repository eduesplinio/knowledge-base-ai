'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Button } from '@workspace/ui/components/button';
import { MdLogout, MdMenuBook } from 'react-icons/md';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/95 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
              <MdMenuBook className="w-4 h-4 text-primary" />
            </div>
            <span className="text-lg font-semibold">Base de Conhecimento</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Espaços
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-muted-foreground hover:text-foreground"
            >
              <MdLogout className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
