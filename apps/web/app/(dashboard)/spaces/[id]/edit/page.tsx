'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchSpace, updateSpace } from '@/lib/api';
import { SpaceForm } from '@/components/spaces/space-form';

export default function EditSpacePage() {
  const [space, setSpace] = useState<{ name: string; description?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const params = useParams();
  const spaceId = params.id as string;

  useEffect(() => {
    async function loadSpace() {
      try {
        const data = await fetchSpace(spaceId);
        setSpace(data);
      } catch (err) {
        setError('Erro ao carregar espaço');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadSpace();
  }, [spaceId]);

  const handleUpdate = async (data: { name: string; description: string }) => {
    await updateSpace(spaceId, data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (error || !space) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-destructive">{error || 'Espaço não encontrado'}</p>
      </div>
    );
  }

  return <SpaceForm title="Editar Espaço" initialData={space} onSubmit={handleUpdate} />;
}
