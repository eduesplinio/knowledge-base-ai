'use client';

import { useEffect, useState } from 'react';
import { SpaceList } from '@/components/spaces/space-list';
import { fetchSpaces } from '@/lib/api';
import { Button } from '@workspace/ui/components/button';
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Meus Espaços</h1>
        <Link href="/spaces/new">
          <Button>Criar Espaço</Button>
        </Link>
      </div>

      <SpaceList spaces={spaces} />
    </div>
  );
}
