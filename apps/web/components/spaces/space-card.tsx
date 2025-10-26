'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MdMoreVert, MdEdit, MdDelete } from 'react-icons/md';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { Button } from '@workspace/ui/components/button';

interface SpaceCardProps {
  space: {
    _id: string;
    name: string;
    description?: string;
  };
  onDelete?: () => void;
}

export function SpaceCard({ space, onDelete }: SpaceCardProps) {
  const router = useRouter();

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/spaces/${space._id}/edit`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow relative group">
      <Link href={`/spaces/${space._id}`} className="block">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle>{space.name}</CardTitle>
              {space.description && <CardDescription>{space.description}</CardDescription>}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MdMoreVert className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleEdit}>
                  <MdEdit className="mr-2 h-5 w-5" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete}>
                  <MdDelete className="mr-2 h-5 w-5" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Clique para ver os artigos</p>
        </CardContent>
      </Link>
    </Card>
  );
}
