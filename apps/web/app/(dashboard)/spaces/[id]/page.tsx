'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@workspace/ui/components/button';
import { ArticleList } from '@/components/articles/article-list';
import { fetchSpace, fetchArticles, deleteArticle, createArticle, updateArticle } from '@/lib/api';
import { FileUpload } from '@/components/articles/file-upload';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import { MdAutoAwesome } from 'react-icons/md';
import { Loading } from '@/components/ui/loading';
import { useToast } from '@workspace/ui/hooks/use-toast';

interface Space {
  _id: string;
  name: string;
  description?: string;
}

interface Article {
  _id: string;
  title: string;
  content: string;
  tags: string[];
}

export default function SpaceDetailPage() {
  const params = useParams();
  const spaceId = params.id as string;

  const [space, setSpace] = useState<Space | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [articleForm, setArticleForm] = useState({ title: '', content: '', tags: '' });
  const [isSavingArticle, setIsSavingArticle] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const { success, error: showError } = useToast();

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [spaceData, articlesData] = await Promise.all([
        fetchSpace(spaceId),
        fetchArticles(spaceId),
      ]);
      setSpace(spaceData);
      setArticles(articlesData.sort((a: Article, b: Article) => a.title.localeCompare(b.title)));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  }, [spaceId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await deleteArticle(deleteId);
      setArticles(articles.filter((article) => article._id !== deleteId));
      setDeleteId(null);
      // Aguarda um tick para garantir que o estado foi atualizado
      setTimeout(() => {
        success('Artigo excluído com sucesso!');
      }, 0);
    } catch (error) {
      console.error('Erro ao deletar artigo:', error);
      showError('Erro ao excluir artigo');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateArticle = () => {
    setEditingArticle(null);
    setArticleForm({ title: '', content: '', tags: '' });
    setAiPrompt('');
    setAiError('');
    setIsArticleModalOpen(true);
  };

  const handleEditArticle = (articleId: string) => {
    const article = articles.find((a) => a._id === articleId);
    if (article) {
      setEditingArticle(article);
      setArticleForm({
        title: article.title,
        content: article.content,
        tags: article.tags.join(', '),
      });
      setAiPrompt('');
      setAiError('');
      setIsArticleModalOpen(true);
    }
  };

  const handleArticleModalClose = () => {
    setIsArticleModalOpen(false);
    setEditingArticle(null);
    setArticleForm({ title: '', content: '', tags: '' });
    setAiPrompt('');
    setAiError('');
  };

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
      setArticleForm((prev) => ({ ...prev, content: data.content }));
      setAiPrompt('');
      success('Conteúdo gerado com sucesso!');
    } catch (err) {
      setAiError('Não foi possível gerar o conteúdo. Tente novamente.');
      showError('Erro ao gerar conteúdo com IA');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveArticle = async () => {
    if (!articleForm.title.trim() || !articleForm.content.trim()) return;

    setIsSavingArticle(true);
    try {
      const tags = articleForm.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      if (editingArticle) {
        const updatedArticle = await updateArticle(editingArticle._id, {
          title: articleForm.title,
          content: articleForm.content,
          tags,
        });
        setArticles(
          articles
            .map((a) => (a._id === editingArticle._id ? updatedArticle : a))
            .sort((a: Article, b: Article) => a.title.localeCompare(b.title))
        );
        success('Artigo atualizado com sucesso!');
      } else {
        const newArticle = await createArticle({
          title: articleForm.title,
          content: articleForm.content,
          spaceId,
          tags,
        });
        setArticles(
          [...articles, newArticle].sort((a: Article, b: Article) => a.title.localeCompare(b.title))
        );
        success('Artigo criado com sucesso!');
      }

      handleArticleModalClose();
    } catch (err) {
      console.error('Erro ao salvar artigo:', err);
      showError('Erro ao salvar artigo');
    } finally {
      setIsSavingArticle(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!space) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Space não encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: space.name }]} />

      <div>
        <h1 className="text-3xl font-bold">{space.name}</h1>
        {space.description && (
          <p className="text-muted-foreground mt-1 whitespace-pre-wrap">{space.description}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleCreateArticle}>Novo Artigo</Button>
        <FileUpload
          spaceId={spaceId}
          onArticleCreated={(article) =>
            setArticles(
              [...articles, article].sort((a: Article, b: Article) =>
                a.title.localeCompare(b.title)
              )
            )
          }
        />
      </div>

      <ArticleList
        articles={articles}
        onDelete={(id) => setDeleteId(id)}
        onEdit={handleEditArticle}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a excluir este artigo. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isArticleModalOpen} onOpenChange={handleArticleModalClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle>{editingArticle ? 'Editar Artigo' : 'Novo Artigo'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium block">Título</label>
              <Input
                value={articleForm.title}
                onChange={(e) => setArticleForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Como usar React Hooks"
              />
            </div>

            <div className="space-y-2 border-t pt-4">
              <label className="text-sm font-medium block">Gerar conteúdo com IA</label>
              <div className="flex gap-2">
                <Input
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ex: Escreva um artigo sobre TypeScript"
                  disabled={isGenerating || isSavingArticle}
                />
                <Button
                  type="button"
                  onClick={handleGenerateWithAI}
                  disabled={isGenerating || isSavingArticle || !aiPrompt.trim()}
                  variant="secondary"
                  className="flex items-center gap-2 flex-shrink-0"
                >
                  {isGenerating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300" />
                  ) : (
                    <MdAutoAwesome className="h-4 w-4" />
                  )}
                  {isGenerating ? 'Gerando...' : 'Gerar'}
                </Button>
              </div>
              {aiError && <p className="text-sm text-destructive">{aiError}</p>}
              <p className="text-xs text-muted-foreground">
                O conteúdo gerado será inserido no campo abaixo
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium block">Conteúdo</label>
              <Textarea
                value={articleForm.content}
                onChange={(e) => setArticleForm((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Escreva o conteúdo do artigo..."
                rows={8}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium block">Tags</label>
              <Input
                value={articleForm.tags}
                onChange={(e) => setArticleForm((prev) => ({ ...prev, tags: e.target.value }))}
                placeholder="Ex: react, hooks, frontend"
              />
              <p className="text-xs text-muted-foreground">Separe as tags com vírgula</p>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleArticleModalClose} disabled={isSavingArticle}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveArticle}
              disabled={isSavingArticle || !articleForm.title.trim() || !articleForm.content.trim()}
            >
              {isSavingArticle ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
