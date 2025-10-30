'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@workspace/ui/components/input';
import { MdSearch } from 'react-icons/md';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <MdSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar artigos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10"
      ></Input>
    </form>
  );
}
