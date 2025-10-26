'use client';

import { useSearchParams } from 'next/navigation';
import { ArticleForm } from '@/components/articles/article-form';
import { createArticle } from '@/lib/api';

export default function NewArticlePage() {
  const searchParams = useSearchParams();
  const spaceId = searchParams.get('spaceId');

  if (!spaceId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">
          Space ID não fornecido. Por favor, crie o artigo a partir de um space.
        </p>
      </div>
    );
  }

  const handleSubmit = async (data: {
    title: string;
    content: string;
    spaceId: string;
    tags: string[];
  }) => {
    await createArticle(data);
  };

  return (
    <div>
      <ArticleForm
        title="Criar Novo Artigo"
        spaceId={spaceId}
        onSubmit={handleSubmit}
        submitLabel="Salvar"
      />
    </div>
  );
}
