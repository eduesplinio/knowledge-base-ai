'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MdAutoAwesome } from 'react-icons/md';
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
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');

  const router = useRouter();

  useEffect(() => {
    if (initialData) {
      setArticleTitle(initialData.title);
      setContent(initialData.content);
      setTagsInput(initialData.tags?.join(', ') || '');
    }
  }, [initialData]);

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) {
      setAiError('Digite um prompt para gerar conteúdo');
      return;
    }

    setAiError('');
    setIsGenerating(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/articles/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          temperature: 0.7,
          maxTokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar conteúdo');
      }

      const data = await response.json();
      setContent(data.content);
      setAiPrompt('');
    } catch (err) {
      setAiError('Não foi possível gerar o conteúdo. Tente novamente.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

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

            <div className="space-y-2 border-t pt-4">
              <Label htmlFor="aiPrompt">Gerar conteúdo com IA</Label>
              <div className="flex gap-2">
                <Input
                  id="aiPrompt"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ex: Escreva um artigo sobre TypeScript"
                  disabled={isGenerating || isLoading}
                />
                <Button
                  type="button"
                  onClick={handleGenerateWithAI}
                  disabled={isGenerating || isLoading || !aiPrompt.trim()}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <MdAutoAwesome className="h-4 w-4" />
                  {isGenerating ? 'Gerando...' : 'Gerar'}
                </Button>
              </div>
              {aiError && <p className="text-sm text-destructive">{aiError}</p>}
              <p className="text-xs text-muted-foreground">
                O conteúdo gerado será inserido no campo abaixo
              </p>
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
              <Label htmlFor="tags">Tags</Label>
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
