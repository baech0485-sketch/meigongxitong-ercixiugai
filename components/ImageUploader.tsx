'use client';

import React from "react"

import { useCallback } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
  const handleFileChange = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        alert('请上传图片文件');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        onImageChange(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    [onImageChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFileChange(file);
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

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {required && <span className="text-xs text-destructive">*必填</span>}
        {!required && <span className="text-xs text-muted-foreground">可选</span>}
      </div>

      {preview ? (
        <div className="group relative overflow-hidden rounded-xl border-2 border-border bg-card">
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="h-48 w-full object-contain p-2"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClear}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              移除图片
            </Button>
          </div>
          <div className="absolute bottom-2 left-2 right-2">
            <p className="truncate rounded-lg bg-background/80 px-2 py-1 text-xs text-muted-foreground backdrop-blur-sm">
              {image?.name}
            </p>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={cn(
            'relative flex h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-all duration-200',
            'border-border bg-card hover:border-primary/50 hover:bg-secondary/30'
          )}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <div className="rounded-xl bg-secondary p-3">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              点击或拖拽上传图片
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              支持 JPG, PNG, WebP 格式
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
