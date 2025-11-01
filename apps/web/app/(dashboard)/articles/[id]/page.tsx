'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MdArrowBack, MdEdit, MdDelete } from 'react-icons/md';
import { Button } from '@workspace/ui/components/button';
import { ArticleViewer } from '@/components/articles/article-viewer';
import { fetchArticle, deleteArticle, fetchSpace } from '@/lib/api';
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

export default function ArticleViewPage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;

  const [article, setArticle] = useState<any>(null);
  const [space, setSpace] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
    } catch (error) {
      console.error('Erro ao carregar artigo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteArticle(articleId);
      router.push(`/spaces/${article.spaceId}`);
    } catch (error) {
      console.error('Erro ao deletar artigo:', error);
    }
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
    <div className="space-y-6">
      {space && (
        <Breadcrumbs
          items={[{ label: space.name, href: `/spaces/${space._id}` }, { label: article.title }]}
        />
      )}

      <div className="flex justify-end">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/articles/${articleId}/edit`)}>
            <MdEdit className="mr-2 h-5 w-5" />
            Editar
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            <MdDelete className="mr-2 h-5 w-5" />
            Excluir
          </Button>
        </div>
      </div>

      <ArticleViewer article={article} />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este artigo? Esta ação não pode ser desfeita.
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
