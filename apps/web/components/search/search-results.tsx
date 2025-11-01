'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';

interface SearchResult {
  _id: string;
  title: string;
  content: string;
  spaceId: string;
  tags: string[];
  score: number;
  createdAt: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
}

export function SearchResults({ results, query }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="space-y-3">
          <p className="text-lg font-medium">Nenhum resultado encontrado</p>
          <p className="text-muted-foreground">
            Tente usar palavras-chave diferentes ou mais gerais
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado
        {results.length !== 1 ? 's' : ''} para "{query}"
      </p>

      {results.map((result) => (
        <Link key={result._id} href={`/articles/${result._id}`}>
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-lg">{result.title}</CardTitle>
                <Badge variant="secondary">{Math.round(result.score * 100)}% relevante</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">{result.content}</p>
              {result.tags.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {result.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
