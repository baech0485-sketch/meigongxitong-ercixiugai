'use client';

import React from "react"
import { useCallback, useEffect, useRef, useState } from 'react';
import { Upload, X, Clipboard, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { compressImage } from '@/lib/imageCompressor';

interface ImageUploaderProps {
  label: string;
  required?: boolean;
  image: File | null;
  preview: string | null;
  onImageChange: (file: File | null, preview: string | null) => void;
}

export function ImageUploader({
  label,
  required = false,
  image,
  preview,
  onImageChange,
}: ImageUploaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileChange = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        alert('请上传图片文件');
        return;
      }

      setIsCompressing(true);
      try {
        const compressedFile = await compressImage(file, {
          maxWidth: 1920,
          maxHeight: 1920,
          quality: 0.8,
          maxSizeKB: 500,
        });

        const reader = new FileReader();
        reader.onload = () => {
          onImageChange(compressedFile, reader.result as string);
          setIsCompressing(false);
        };
        reader.onerror = () => {
          setIsCompressing(false);
          alert('图片读取失败');
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        setIsCompressing(false);
        console.error('压缩失败:', error);
        const reader = new FileReader();
        reader.onload = () => {
          onImageChange(file, reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageChange]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            handleFileChange(file);
            break;
          }
        }
      }
    },
    [handleFileChange]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileChange(file);
    },
    [handleFileChange]
  );

  const handleClear = useCallback(() => {
    onImageChange(null, null);
  }, [onImageChange]);

  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      if (containerRef.current?.matches(':hover, :focus-within')) {
        handlePaste(e);
      }
    };

    document.addEventListener('paste', handleGlobalPaste);
    return () => {
      document.removeEventListener('paste', handleGlobalPaste);
    };
  }, [handlePaste]);

  return (
    <div ref={containerRef} className="space-y-3" tabIndex={0}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {required && <span className="text-xs text-destructive">*必填</span>}
        {!required && <span className="text-xs text-muted-foreground">可选</span>}
      </div>

      {isCompressing ? (
        <div className="flex h-40 flex-col items-center justify-center gap-3 rounded-xl border-2 border-primary/30 bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">正在压缩图片...</p>
        </div>
      ) : preview ? (
        <div className="group relative overflow-hidden rounded-xl border-2 border-primary/30 bg-card">
          <img
            src={preview}
            alt="Preview"
            className="h-40 w-full object-contain p-2"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 transition-opacity group-hover:opacity-100">
            <Button variant="destructive" size="sm" onClick={handleClear}>
              <X className="mr-1 h-4 w-4" />
              移除
            </Button>
          </div>
          <div className="absolute bottom-2 left-2 right-2">
            <p className="truncate rounded bg-background/80 px-2 py-1 text-xs text-muted-foreground">
              {image?.name}
            </p>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'group relative flex h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-all',
            'border-border bg-card hover:border-primary/50 hover:bg-secondary/50'
          )}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <div className="flex gap-2">
            <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
            <Clipboard className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">点击上传或 Ctrl+V 粘贴</p>
            <p className="text-xs text-muted-foreground">支持 JPG, PNG, WebP（自动压缩）</p>
          </div>
        </div>
      )}
    </div>
  );
}
