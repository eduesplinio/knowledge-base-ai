'use client';

import { createSpace } from '@/lib/api';
import { SpaceForm } from '@/components/spaces/space-form';

export default function NewSpacePage() {
  const handleCreate = async (data: { name: string; description: string }) => {
    await createSpace(data);
  };

  return <SpaceForm title="Criar Novo Espaço" onSubmit={handleCreate} />;
}
