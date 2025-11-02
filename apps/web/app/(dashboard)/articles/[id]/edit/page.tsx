'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { ArticleForm } from '@/components/articles/article-form';
import { fetchArticle, updateArticle } from '@/lib/api';

interface Article {
  _id: string;
  title: string;
  content: string;
  spaceId: string;
  tags: string[];
}

export default function EditArticlePage() {
  const params = useParams();
  const articleId = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadArticle = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchArticle(articleId);
      setArticle(data);
    } catch (error) {
      console.error('Erro ao carregar artigo:', error);
    } finally {
      setIsLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    loadArticle();
  }, [loadArticle]);

  const handleSubmit = async (data: {
    title: string;
    content: string;
    spaceId: string;
    tags: string[];
  }) => {
    await updateArticle(articleId, data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Artigo não encontrado</p>
      </div>
    );
  }

  return (
    <div>
      <ArticleForm
        title="Editar Artigo"
        spaceId={article.spaceId}
        initialData={{
          title: article.title,
          content: article.content,
          tags: article.tags || [],
        }}
        onSubmit={handleSubmit}
        submitLabel="Salvar"
      />
    </div>
  );
}
