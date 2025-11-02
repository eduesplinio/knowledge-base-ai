'use client';

import Link from 'next/link';
import { MdArrowForward, MdMoreVert, MdEdit, MdDelete } from 'react-icons/md';
import { MdOutlineLibraryBooks } from 'react-icons/md';
import { Card } from '@workspace/ui/components/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { Button } from '@workspace/ui/components/button';

interface SpaceCardProps {
  space: {
    _id: string;
    name: string;
    description?: string;
    authorId?: string;
  };
  onDelete?: () => void;
  onEdit?: () => void;
  isDropdownOpen?: boolean;
  onDropdownChange?: (open: boolean) => void;
}

export function SpaceCard({
  space,
  onDelete,
  onEdit,
  isDropdownOpen = false,
  onDropdownChange,
}: SpaceCardProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <Card
      className={`group relative overflow-hidden rounded-md border-border bg-transparent hover:bg-accent/50 transition-colors w-[380px] lg:w-[300px] h-[120px] ${isDropdownOpen ? 'bg-accent/50' : ''}`}
    >
      <Link href={`/spaces/${space._id}`} className="block p-3 h-full relative">
        <div className="pr-6">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <MdOutlineLibraryBooks className="w-[22px] h-[22px] text-muted-foreground flex-shrink-0" />
              <div className="text-base font-light flex-1 min-w-0 leading-tight break-words line-clamp-2">
                {space.name}
              </div>
            </div>
            {space.description && (
              <div className="text-sm text-muted-foreground/80 leading-tight line-clamp-2 break-words overflow-hidden">
                {space.description}
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-1 right-3">
          <MdArrowForward className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </div>

        <div className="absolute top-2 right-3 flex justify-end">
          <DropdownMenu open={isDropdownOpen} onOpenChange={onDropdownChange}>
            <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
              >
                <MdMoreVert className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <MdEdit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete}>
                <MdDelete className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Link>
    </Card>
  );
}
