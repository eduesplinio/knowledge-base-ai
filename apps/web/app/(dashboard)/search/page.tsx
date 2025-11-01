'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { SearchResults } from '@/components/search/search-results';

interface SearchResult {
  _id: string;
  title: string;
  content: string;
  spaceId: string;
  tags: string[];
  score: number;
  createdAt: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setIsLoading(true);
      setError('');

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(
          `${apiUrl}/articles/search?q=${encodeURIComponent(query)}&limit=5`
        );

        if (!response.ok) {
          throw new Error('Erro ao buscar artigos');
        }

        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError('Não foi possível realizar a busca. Tente novamente.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (!query) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Digite algo na barra de busca para começar</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Buscando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Resultados da Busca</h1>
      </div>
      <SearchResults results={results} query={query} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
