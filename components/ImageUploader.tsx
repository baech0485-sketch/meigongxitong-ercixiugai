'use client';

import React from "react"
import { useCallback, useEffect, useRef, useState } from 'react';
import { Upload, X, Clipboard, ImagePlus, ZoomIn } from 'lucide-react';
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
  const containerRef = useRef<HTMLDivElement>(null);

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

  // 处理粘贴事件
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

  // 监听全局粘贴事件
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      // 检查容器是否获得焦点或鼠标悬停
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
        <span className="text-sm font-semibold text-foreground">{label}</span>
        {required && (
          <span className="rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
            必填
          </span>
        )}
        {!required && (
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            可选
          </span>
        )}
      </div>

      {preview ? (
        <div className="group relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-card shadow-lg">
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="h-52 w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          />
          {/* 悬停遮罩 */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 bg-background/90 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClear}
              className="gap-2 shadow-lg"
            >
              <X className="h-4 w-4" />
              移除
            </Button>
          </div>
          {/* 文件名标签 */}
          <div className="absolute bottom-3 left-3 right-3">
            <p className="truncate rounded-xl bg-background/90 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
              {image?.name}
            </p>
          </div>
          {/* 成功指示器 */}
          <div className="absolute right-3 top-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 shadow-lg">
              <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'group relative flex h-52 cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed transition-all duration-300',
            'border-border bg-gradient-to-b from-card to-secondary/30',
            'hover:border-primary/50 hover:bg-gradient-to-b hover:from-primary/5 hover:to-primary/10 hover:shadow-lg'
          )}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          {/* 图标组 */}
          <div className="flex gap-3">
            <div className="rounded-xl bg-secondary p-3 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-primary/15 group-hover:shadow-md">
              <Upload className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
            </div>
            <div className="rounded-xl bg-secondary p-3 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-primary/15 group-hover:shadow-md" style={{ transitionDelay: '50ms' }}>
              <Clipboard className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
            </div>
          </div>
          {/* 提示文字 */}
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">
              点击上传或 Ctrl+V 粘贴
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground">
              支持 JPG, PNG, WebP 格式
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
