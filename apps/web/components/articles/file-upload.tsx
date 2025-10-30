'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import { MdUploadFile, MdClose } from 'react-icons/md';
import { Progress } from '@workspace/ui/components/progress';

interface FileUploadProps {
  spaceId: string;
}

export function FileUpload({ spaceId }: FileUploadProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    const validExtensions = ['.md', '.txt'];
    const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.'));

    if (!validExtensions.includes(fileExtension.toLowerCase())) {
      setError('Apenas arquivos .md e .txt são permitidos');
      setFile(null);
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError('Arquivo muito grande. Tamanho máximo: 5MB');
      setFile(null);
      return;
    }

    setError('');
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Selecione um arquivo');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('spaceId', spaceId);

      if (tags.trim()) {
        const tagArray = tags.split(',').map((tag) => tag.trim());
        tagArray.forEach((tag) => {
          formData.append('tags[]', tag);
        });
      }

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/articles/upload`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error('Erro ao fazer upload do arquivo');
      }

      const article = await response.json();

      setOpen(false);
      router.push(`/articles/${article._id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload do arquivo');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setOpen(false);
      setFile(null);
      setTags('');
      setError('');
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MdUploadFile className="mr-2 h-4 w-4" />
          Upload de Arquivo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload de Documento</DialogTitle>
          <DialogDescription>
            Faça upload de um arquivo .md ou .txt para criar um artigo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Seleção de arquivo */}
          <div className="space-y-2">
            <Label htmlFor="file">Arquivo</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".md,.txt"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={isUploading}
              />
              {file && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  disabled={isUploading}
                >
                  <MdClose className="h-4 w-4" />
                </Button>
              )}
            </div>
            {file && (
              <p className="text-sm text-muted-foreground">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (opcional)</Label>
            <Input
              id="tags"
              placeholder="tag1, tag2, tag3"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              disabled={isUploading}
            />
            <p className="text-xs text-muted-foreground">Separe as tags por vírgula</p>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-sm text-center text-muted-foreground">
                Fazendo upload... {uploadProgress}%
              </p>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Cancelar
          </Button>
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? 'Enviando...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
