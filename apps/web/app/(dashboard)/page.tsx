'use client';

import { useEffect, useState } from 'react';
import { SpaceCard } from '@/components/spaces/space-card';
import { fetchSpaces, deleteSpace, createSpace, updateSpace } from '@/lib/api';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import { MdAdd, MdMenuBook } from 'react-icons/md';
import { SearchBar } from '@/components/search/search-bar';
import { Loading } from '@/components/ui/loading';
import { useToast } from '@workspace/ui/hooks/use-toast';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<Space | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const { success, error: showError } = useToast();

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
    setOpenDropdownId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!spaceToDelete) return;

    setIsDeleting(true);
    try {
      await deleteSpace(spaceToDelete._id);
      setSpaces(spaces.filter((s) => s._id !== spaceToDelete._id));
      success('Espaço excluído com sucesso!');
      setSpaceToDelete(null);
    } catch (err) {
      console.error('Erro ao deletar espaço:', err);
      showError('Erro ao excluir espaço');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setSpaceToDelete(null);
    setOpenDropdownId(null);
  };

  const handleCreateSpace = () => {
    setEditingSpace(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleEditSpace = (space: Space) => {
    setEditingSpace(space);
    setFormData({ name: space.name, description: space.description || '' });
    setOpenDropdownId(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSpace(null);
    setFormData({ name: '', description: '' });
    setOpenDropdownId(null);
  };

  const handleSaveSpace = async () => {
    if (!formData.name.trim()) return;

    setIsSaving(true);
    try {
      if (editingSpace) {
        const updatedSpace = await updateSpace(editingSpace._id, formData);
        setSpaces(spaces.map((s) => (s._id === editingSpace._id ? updatedSpace : s)));
        success('Espaço atualizado com sucesso!');
      } else {
        const newSpace = await createSpace(formData);
        setSpaces([...spaces, newSpace]);
        success('Espaço criado com sucesso!');
      }
      handleModalClose();
    } catch (err) {
      console.error('Erro ao salvar espaço:', err);
      showError('Erro ao salvar espaço');
    } finally {
      setIsSaving(false);
    }
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return <Loading message="Carregando..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <p className="text-destructive text-lg">{error}</p>
          <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh]">
      <div className="text-center space-y-6 py-12 max-w-3xl mx-auto">
        <div className="flex justify-center">
          <MdMenuBook className="w-16 h-16 text-foreground/70" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-normal tracking-tight">Base de Conhecimento</h1>
          <p className="text-muted-foreground text-lg">
            Seu conhecimento organizado e acessível com IA
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <SearchBar onOpenSearch={() => setOpenDropdownId('search')} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto pb-12 px-4">
        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
          <div
            onClick={handleCreateSpace}
            className="group relative overflow-hidden rounded-md border border-border bg-gradient-to-br from-slate-100 from-10% via-blue-100 via-40% to-indigo-200 to-90% dark:from-slate-700/60 dark:from-10% dark:via-slate-800/50 dark:via-40% dark:to-slate-900/70 dark:to-90% hover:from-slate-200 hover:via-blue-200 hover:to-indigo-300 dark:hover:from-slate-600/70 dark:hover:via-slate-700/60 dark:hover:to-slate-800/80 transition-all duration-300 cursor-pointer w-[380px] lg:w-[300px] h-[120px]"
          >
            <div className="p-3 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <MdAdd className="w-[22px] h-[22px] text-primary flex-shrink-0" />
                  <div className="text-base font-light group-hover:text-primary transition-colors">
                    Adicionar espaço
                  </div>
                </div>
                <div className="text-xs text-muted-foreground/60">Organize temas e artigos</div>
              </div>
            </div>
          </div>

          {spaces.map((space) => (
            <SpaceCard
              key={space._id}
              space={space}
              onDelete={() => handleDeleteClick(space)}
              onEdit={() => handleEditSpace(space)}
              isDropdownOpen={openDropdownId === space._id}
              onDropdownChange={(open) => setOpenDropdownId(open ? space._id : null)}
            />
          ))}
        </div>
      </div>

      <AlertDialog open={!!spaceToDelete} onOpenChange={handleDeleteCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a excluir o espaço &quot;
              <span className="font-semibold">{truncateText(spaceToDelete?.name || '', 50)}</span>
              &quot;. Esta ação não pode ser desfeita e todos os artigos deste espaço serão
              perdidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="pb-4">
            <DialogTitle>{editingSpace ? 'Editar Espaço' : 'Novo Espaço'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium block">Nome</label>
              <Input
                value={formData.name}
                onChange={(e) => {
                  if (e.target.value.length <= 50) {
                    setFormData({ ...formData, name: e.target.value });
                  }
                }}
                placeholder="Nome do espaço"
                maxLength={50}
              />
              <div className="text-xs text-muted-foreground text-right">
                {formData.name.length}/50
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium block">Descrição</label>
              <Textarea
                value={formData.description}
                onChange={(e) => {
                  if (e.target.value.length <= 150) {
                    setFormData({ ...formData, description: e.target.value });
                  }
                }}
                placeholder="Descrição do espaço (opcional)"
                rows={3}
                maxLength={150}
                className="resize-none"
              />
              <div className="text-xs text-muted-foreground text-right">
                {formData.description.length}/150
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleModalClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSaveSpace} disabled={isSaving || !formData.name.trim()}>
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
