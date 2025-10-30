'use client';

import { useEffect, useState } from 'react';
import { SpaceList } from '@/components/spaces/space-list';
import { fetchSpaces, deleteSpace } from '@/lib/api';
import { Button } from '@workspace/ui/components/button';
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
import Link from 'next/link';

interface Space {
  _id: string;
  name: string;
  description?: string;
}

export default function DashboardPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [spaceToDelete, setSpaceToDelete] = useState<Space | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadSpaces() {
      try {
        const data = await fetchSpaces();
        setSpaces(data);
      } catch (err) {
        setError('Erro ao carregar espaços');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadSpaces();
  }, []);

  const handleDeleteClick = (space: Space) => {
    setSpaceToDelete(space);
  };

  const handleDeleteConfirm = async () => {
    if (!spaceToDelete) return;

    setIsDeleting(true);
    try {
      await deleteSpace(spaceToDelete._id);
      setSpaces(spaces.filter((s) => s._id !== spaceToDelete._id));
      setSpaceToDelete(null);
    } catch (err) {
      console.error('Erro ao deletar espaço:', err);
      alert('Erro ao deletar espaço');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setSpaceToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-6 mb-8">
        <h1 className="text-3xl font-bold">Espaços</h1>
        <Link href="/spaces/new">
          <Button>Novo Espaço</Button>
        </Link>
      </div>

      <SpaceList spaces={spaces} onDeleteClick={handleDeleteClick} />

      <AlertDialog open={!!spaceToDelete} onOpenChange={handleDeleteCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a deletar o espaço &quot;{spaceToDelete?.name}&quot;. Esta ação não
              pode ser desfeita e todos os artigos deste espaço serão perdidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? 'Deletando...' : 'Deletar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
