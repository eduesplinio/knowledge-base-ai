'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Button } from '@workspace/ui/components/button';
import { MdLogout, MdMenuBook, MdMenu, MdSearch } from 'react-icons/md';
import { Sidebar } from '@/components/layout/sidebar';
import { SearchModal } from '@/components/search/search-modal';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebarCollapsed') === 'true';
    }
    return false;
  });
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex h-screen">
          <div className="w-64 bg-muted/30 border-r border-border" />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-8">{children}</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/95 sticky top-0 z-50 md:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <MdMenu className="h-5 w-5" />
          </Button>

          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
              <MdMenuBook className="w-4 h-4 text-primary" />
            </div>
            <span className="text-lg font-semibold">KB</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSearchModalOpen(true)}>
              <MdSearch className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: '/login' })}>
              <MdLogout className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-screen">
        <div
          className={`${isMobile ? 'fixed inset-y-0 left-0 z-40' : 'relative'} ${isMobile && !mobileMenuOpen ? 'hidden' : ''}`}
        >
          <Sidebar
            isCollapsed={sidebarCollapsed && !isMobile}
            isMobile={isMobile}
            onSearchOpen={() => setSearchModalOpen(true)}
            onToggleCollapse={
              isMobile
                ? () => setMobileMenuOpen(false)
                : () => {
                    const newCollapsed = !sidebarCollapsed;
                    setSidebarCollapsed(newCollapsed);
                    localStorage.setItem('sidebarCollapsed', newCollapsed.toString());
                  }
            }
          />
        </div>

        {isMobile && mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8">{children}</div>
        </main>
      </div>

      {isMobile ? (
        <SearchModal open={searchModalOpen} onOpenChange={setSearchModalOpen} />
      ) : (
        <SearchModal
          open={searchModalOpen}
          onOpenChange={setSearchModalOpen}
          enableKeyboardShortcut={true}
        />
      )}
    </div>
  );
}
