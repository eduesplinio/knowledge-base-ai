'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@workspace/ui/components/input';
import { MdSearch } from 'react-icons/md';
import { getKeyboardShortcut } from '@/lib/keyboard';

export function InlineSearch() {
  const [query, setQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <MdSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="O que você está procurando?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`pl-10 h-9 rounded-md bg-background/50 border-muted-foreground/20 placeholder:text-muted-foreground/60 ${isMobile ? 'pr-3 text-base' : 'pr-16 text-sm'}`}
      />
      {!isMobile && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            {getKeyboardShortcut().isMac ? (
              <>
                <span className="text-sm leading-none">⌘</span>
                <span className="leading-none">K</span>
              </>
            ) : (
              'Ctrl+K'
            )}
          </kbd>
        </div>
      )}
    </form>
  );
}
