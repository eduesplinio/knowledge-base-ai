'use client';

import { ArticleCard } from './article-card';

interface ArticleListProps {
  articles: Array<{
    _id: string;
    title: string;
    content: string;
    tags: string[];
  }>;
  onDelete?: (id: string) => void;
  searchQuery?: string;
}

export function ArticleList({ articles, onDelete, searchQuery }: ArticleListProps) {
  if (!articles || articles.length === 0) {
    if (searchQuery && searchQuery.trim()) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhum artigo encontrado para &quot;{searchQuery}&quot;
          </p>
          <p className="text-sm text-muted-foreground mt-2">Tente buscar com outros termos.</p>
        </div>
      );
    }
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhum artigo encontrado. Crie seu primeiro artigo!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard
          key={article._id}
          article={article}
          onDelete={onDelete ? () => onDelete(article._id) : undefined}
        />
      ))}
    </div>
  );
}
