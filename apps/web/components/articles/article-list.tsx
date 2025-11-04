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
  onEdit?: (id: string) => void;
  searchQuery?: string;
  openDropdownId?: string | null;
  onDropdownChange?: (id: string | null) => void;
}

export function ArticleList({
  articles,
  onDelete,
  onEdit,
  searchQuery,
  openDropdownId,
  onDropdownChange,
}: ArticleListProps) {
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
    <div className="w-full px-4 space-y-1">
      {articles.map((article) => (
        <ArticleCard
          key={article._id}
          article={article}
          onDelete={onDelete ? () => onDelete(article._id) : undefined}
          onEdit={onEdit ? () => onEdit(article._id) : undefined}
          isDropdownOpen={openDropdownId === article._id}
          onDropdownChange={(open) => onDropdownChange?.(open ? article._id : null)}
        />
      ))}
    </div>
  );
}
