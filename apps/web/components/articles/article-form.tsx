'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';

interface ArticleFormProps {
  title: string;
  spaceId: string;
  initialData?: {
    title: string;
    content: string;
    tags: string[];
  };
  onSubmit: (data: {
    title: string;
    content: string;
    spaceId: string;
    tags: string[];
  }) => Promise<void>;
  submitLabel?: string;
}

export function ArticleForm({
  title,
  spaceId,
  initialData,
  onSubmit,
  submitLabel = 'Salvar',
}: ArticleFormProps) {
  const [articleTitle, setArticleTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  useEffect(() => {
    if (initialData) {
      setArticleTitle(initialData.title);
      setContent(initialData.content);
      setTagsInput(initialData.tags?.join(', ') || '');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const tags = tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await onSubmit({
        title: articleTitle,
        content,
        spaceId,
        tags,
      });

      router.push(`/spaces/${spaceId}`);
    } catch (err) {
      setError('Erro ao salvar artigo');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
                placeholder="Ex: Como usar React Hooks"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escreva o conteúdo do artigo..."
                required
                disabled={isLoading}
                rows={12}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Ex: react, hooks, frontend"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">Separe as tags com vírgula</p>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/spaces/${spaceId}`)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : submitLabel}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
