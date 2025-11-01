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

        <div className="text-foreground leading-relaxed">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-4 text-foreground">{children}</p>,
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold mb-4 text-foreground">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold mb-3 text-foreground">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-medium mb-2 text-foreground">{children}</h3>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-4 text-foreground">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-4 text-foreground">{children}</ol>
              ),
              li: ({ children }) => <li className="mb-1 text-foreground">{children}</li>,
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">{children}</strong>
              ),
              em: ({ children }) => <em className="italic text-foreground">{children}</em>,
              code: ({ children }) => (
                <code className="bg-muted px-1 py-0.5 rounded text-sm text-foreground">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-muted p-4 rounded-md overflow-x-auto mb-4 text-foreground">
                  {children}
                </pre>
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}
