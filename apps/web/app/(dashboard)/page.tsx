'use client';

import { useEffect, useState } from 'react';
import { SpaceList } from '@/components/spaces/space-list';
import { fetchSpaces, deleteSpace } from '@/lib/api';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
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
import { MdSearch } from 'react-icons/md';
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
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredSpaces = spaces.filter((space) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const name = space.name.toLowerCase();
    const desc = (space.description || '').toLowerCase();

    return name.includes(query) || desc.includes(query);
  });

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Espaços</h1>
        <div className="flex items-center justify-between gap-4">
          <Link href="/spaces/new">
            <Button>Novo Espaço</Button>
          </Link>
          <div className="relative flex-1 max-w-md">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar espaços..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <SpaceList
        spaces={filteredSpaces}
        onDeleteClick={handleDeleteClick}
        searchQuery={searchQuery}
      />

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
