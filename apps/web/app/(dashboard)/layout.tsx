'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Button } from '@workspace/ui/components/button';
import { MdLogout } from 'react-icons/md';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Base de Conhecimento</h1>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-sm hover:underline">
              Espaços
            </Link>
            <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: '/login' })}>
              <MdLogout className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
