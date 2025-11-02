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
import { useToast } from '@workspace/ui/hooks/use-toast';

interface FileUploadProps {
  spaceId: string;
  onArticleCreated?: (article: any) => void;
}

export function FileUpload({ spaceId, onArticleCreated }: FileUploadProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { success, error: showError } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    const validExtensions = ['.md', '.txt'];
    const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.'));

    if (!validExtensions.includes(fileExtension.toLowerCase())) {
      setError('Formato não suportado. Use arquivos .md ou .txt');
      showError('Formato não suportado. Use arquivos .md ou .txt');
      setFile(null);
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError('Documento muito grande. Limite de 5MB');
      showError('Documento muito grande. Limite de 5MB');
      setFile(null);
      return;
    }

    setError('');
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Escolha um documento para importar');
      showError('Escolha um documento para importar');
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
        throw new Error('Não foi possível importar o documento');
      }

      const article = await response.json();

      if (onArticleCreated) {
        onArticleCreated(article);
      }
      success('Documento importado com sucesso!');
      setOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Falha na importação do documento';
      setError(errorMessage);
      showError(errorMessage);
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
          Importar Documentos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pb-4">
          <DialogTitle>Importar Documentos</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium block">Documento</label>
            <div className="space-y-2">
              <input
                id="file"
                type="file"
                accept=".md,.txt"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
              />
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex-1"
                >
                  <MdUploadFile className="mr-2 h-4 w-4" />
                  {file ? 'Alterar arquivo' : 'Escolher arquivo'}
                </Button>
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
            </div>
            {file && (
              <p className="text-sm text-muted-foreground">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Arquivos suportados: .md e .txt (máximo 5MB)
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium block">Tags (opcional)</label>
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
                Processando... {uploadProgress}%
              </p>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Cancelar
          </Button>
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? 'Processando...' : 'Importar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
