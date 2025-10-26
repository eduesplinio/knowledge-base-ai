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
import { Badge } from '@workspace/ui/components/badge';

interface ArticleCardProps {
  article: {
    _id: string;
    title: string;
    content: string;
    tags: string[];
  };
  onDelete?: () => void;
}

export function ArticleCard({ article, onDelete }: ArticleCardProps) {
  const router = useRouter();

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/articles/${article._id}/edit`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  const contentPreview =
    article.content.length > 150 ? article.content.substring(0, 150) + '...' : article.content;

  return (
    <Card className="hover:shadow-lg transition-shadow relative group">
      <Link href={`/articles/${article._id}`} className="block">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="break-words">{article.title}</CardTitle>
              <CardDescription className="mt-2 break-words">{contentPreview}</CardDescription>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MdMoreVert className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
