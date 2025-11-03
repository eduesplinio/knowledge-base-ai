'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MdMoreVert, MdEdit, MdDelete } from 'react-icons/md';
import { MdOutlineDescription } from 'react-icons/md';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';

interface ArticleCardProps {
  article: {
    _id: string;
    title: string;
    content: string;
    tags: string[];
  };
  onDelete?: () => void;
  onEdit?: () => void;
}

export function ArticleCard({ article, onDelete, onEdit }: ArticleCardProps) {
  const router = useRouter();

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    } else {
      router.push(`/articles/${article._id}/edit`);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };
  const cleanContent = article.content
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\n+/g, ' ')
    .trim();

  const contentPreview =
    cleanContent.length > 200 ? cleanContent.substring(0, 200) + '...' : cleanContent;

  return (
    <div className="group relative">
      <Link href={`/articles/${article._id}`} className="block">
        <div className="flex items-center gap-4 px-6 py-5 rounded-md border-b border-border/30 hover:bg-accent/50 transition-all">
          <div className="flex-shrink-0">
            <MdOutlineDescription className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-medium text-base break-all group-hover:text-primary transition-colors leading-tight">
                {article.title}
              </h3>
              {article.tags && article.tags.length > 0 && (
                <div className="flex gap-1">
                  {article.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0 h-5">
                      {tag}
                    </Badge>
                  ))}
                  {article.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
                      +{article.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
            {contentPreview && (
              <p className="text-sm text-muted-foreground line-clamp-2">{contentPreview}</p>
            )}
          </div>

          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
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
        </div>
      </Link>
    </div>
  );
}
