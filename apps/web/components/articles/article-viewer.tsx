'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import ReactMarkdown from 'react-markdown';

interface ArticleViewerProps {
  article: {
    title: string;
    content: string;
    tags: string[];
    createdAt: string;
  };
}

export function ArticleViewer({ article }: ArticleViewerProps) {
  const formattedDate = new Date(article.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">{article.title}</CardTitle>
        <p className="text-sm text-muted-foreground">Criado em: {formattedDate}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}
