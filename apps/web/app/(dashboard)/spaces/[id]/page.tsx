'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MdArrowBack } from 'react-icons/md';
import { Button } from '@workspace/ui/components/button';
import Link from 'next/link';
import { ArticleList } from '@/components/articles/article-list';
import { fetchSpace, fetchArticles, deleteArticle } from '@/lib/api';
import { FileUpload } from '@/components/articles/file-upload';
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
  const router = useRouter();
  const spaceId = params.id as string;

  const [space, setSpace] = useState<Space | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spaceId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [spaceData, articlesData] = await Promise.all([
        fetchSpace(spaceId),
        fetchArticles(spaceId),
      ]);
      setSpace(spaceData);
      setArticles(articlesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteArticle(deleteId);
      setArticles(articles.filter((article) => article._id !== deleteId));
      setDeleteId(null);
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

  if (!space) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Space não encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
          <MdArrowBack className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{space.name}</h1>
          {space.description && <p className="text-muted-foreground mt-1">{space.description}</p>}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <Link href={`/articles/new?spaceId=${spaceId}`}>
          <Button>Novo Artigo</Button>
        </Link>
        <FileUpload spaceId={spaceId} />
      </div>

      <ArticleList articles={articles} onDelete={(id) => setDeleteId(id)} />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
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
