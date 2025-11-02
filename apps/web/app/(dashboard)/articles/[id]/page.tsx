'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MdEdit, MdDelete } from 'react-icons/md';
import { Button } from '@workspace/ui/components/button';
import { ArticleViewer } from '@/components/articles/article-viewer';
import { fetchArticle, deleteArticle, fetchSpace, updateArticle } from '@/lib/api';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip';
import { Loading } from '@/components/ui/loading';
import { useToast } from '@workspace/ui/hooks/use-toast';

export default function ArticleViewPage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;

  const [article, setArticle] = useState<any>(null);
  const [space, setSpace] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', content: '', tags: '' });
  const [isSaving, setIsSaving] = useState(false);
  const { success, error: showError } = useToast();

  useEffect(() => {
    loadArticle();
  }, [articleId]);

  const loadArticle = async () => {
    try {
      setIsLoading(true);
      const articleData = await fetchArticle(articleId);
      setArticle(articleData);

      if (articleData.spaceId) {
        const spaceData = await fetchSpace(articleData.spaceId);
        setSpace(spaceData);
      }

      setEditForm({
        title: articleData.title,
        content: articleData.content,
        tags: articleData.tags?.join(', ') || '',
      });
    } catch (error) {
      console.error('Erro ao carregar artigo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteArticle(articleId);
      success('Artigo excluído com sucesso!');
      setTimeout(() => router.push(`/spaces/${article.spaceId}`), 1500);
    } catch (error) {
      console.error('Erro ao deletar artigo:', error);
      showError('Erro ao excluir artigo');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      title: article.title,
      content: article.content,
      tags: article.tags?.join(', ') || '',
    });
  };

  const handleSave = async () => {
    if (!editForm.title.trim() || !editForm.content.trim()) return;

    setIsSaving(true);
    try {
      const tags = editForm.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const updatedArticle = await updateArticle(articleId, {
        title: editForm.title,
        content: editForm.content,
        tags,
      });

      setArticle(updatedArticle);
      setIsEditing(false);
      success('Artigo atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar artigo:', error);
      showError('Erro ao salvar artigo');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!article) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Artigo não encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {space && (
        <Breadcrumbs
          items={[{ label: space.name, href: `/spaces/${space._id}` }, { label: article.title }]}
        />
      )}

      {isEditing ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium block">Título</label>
            <Input
              value={editForm.title}
              onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Título do artigo"
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium block">Conteúdo</label>
            <Textarea
              value={editForm.content}
              onChange={(e) => setEditForm((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Conteúdo do artigo..."
              rows={20}
              className="min-h-[500px] resize-none"
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium block">Tags</label>
            <Input
              value={editForm.tags}
              onChange={(e) => setEditForm((prev) => ({ ...prev, tags: e.target.value }))}
              placeholder="Tags (separadas por vírgula)"
              disabled={isSaving}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !editForm.title.trim() || !editForm.content.trim()}
            >
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative group">
          <div className="absolute top-4 right-4 z-10 flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleEdit}
                    className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-accent"
                  >
                    <MdEdit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Editar artigo</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDeleteDialog(true)}
                    className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-accent"
                  >
                    <MdDelete className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Excluir artigo</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <ArticleViewer article={article} />
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a excluir este artigo. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
