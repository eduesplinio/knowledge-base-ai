'use client';

import Link from 'next/link';
import { Badge } from '@workspace/ui/components/badge';
import { MdOutlineDescription } from 'react-icons/md';

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

      <div className="divide-y divide-border">
        {results.map((result) => {
          const cleanContent = result.content
            .replace(/#{1,6}\s+/g, '')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/`([^`]+)`/g, '$1')
            .replace(/\n+/g, ' ')
            .trim();

          const contentPreview =
            cleanContent.length > 200 ? cleanContent.substring(0, 200) + '...' : cleanContent;

          return (
            <div key={result._id} className="group relative">
              <Link href={`/articles/${result._id}`} className="block">
                <div className="flex items-start gap-4 px-6 py-5 hover:bg-accent/40 transition-all duration-200 cursor-pointer">
                  <div className="flex-shrink-0">
                    <MdOutlineDescription className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="font-semibold text-foreground text-base group-hover:text-primary transition-colors line-clamp-1">
                        {result.title}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="text-xs px-2 py-0.5 h-auto flex-shrink-0"
                      >
                        {Math.round(result.score * 100)}% relevante
                      </Badge>
                    </div>

                    {contentPreview && (
                      <p className="text-sm text-muted-foreground/80 mb-3 line-clamp-2 leading-relaxed">
                        {contentPreview}
                      </p>
                    )}

                    {result.tags && result.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {result.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                        {result.tags.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                            +{result.tags.length - 3} mais
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
