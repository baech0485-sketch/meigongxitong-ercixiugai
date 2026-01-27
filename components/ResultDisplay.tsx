'use client';

import { Download, RefreshCw, CheckCircle, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { ImageType, Platform } from '@/types';
import { IMAGE_SIZES, IMAGE_TYPE_LABELS, PLATFORM_LABELS } from '@/types';

interface ResultDisplayProps {
  resultImage: string | null;
  isLoading: boolean;
  error: string | null;
  imageType: ImageType | null;
  platform: Platform | null;
  onRetry?: () => void;
}

export function ResultDisplay({
  resultImage,
  isLoading,
  error,
  imageType,
  platform,
  onRetry,
}: ResultDisplayProps) {
  const handleDownload = async () => {
    if (!resultImage || !imageType || !platform) return;

    const size = IMAGE_SIZES[imageType][platform];

    // Create canvas for resizing
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size.width;
      canvas.height = size.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 填充白色背景（JPG不支持透明）
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size.width, size.height);

      ctx.drawImage(img, 0, 0, size.width, size.height);

      // 输出为JPG格式，质量0.92
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const timestamp = Date.now();
        a.download = `${imageType}_${platform}_${timestamp}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 'image/jpeg', 0.92);
    };
    img.src = resultImage;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm font-medium text-foreground">AI 正在处理您的图片...</span>
        </div>
        <div className="overflow-hidden rounded-xl border-2 border-border bg-card">
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          <span>预计需要 10-30 秒，请耐心等待</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-destructive">
          <span className="text-sm font-medium">处理失败</span>
        </div>
        <div className="rounded-xl border-2 border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">{error}</p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-4 gap-2 bg-transparent"
            >
              <RefreshCw className="h-4 w-4" />
              重新处理
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (resultImage && imageType && platform) {
    const size = IMAGE_SIZES[imageType][platform];
    
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-green-500">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-medium">处理完成</span>
        </div>
        <div className="overflow-hidden rounded-xl border-2 border-primary/30 bg-card shadow-[0_0_30px_rgba(251,191,36,0.1)]">
          <img
            src={resultImage || "/placeholder.svg"}
            alt="Result"
            className="w-full object-contain"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="rounded-lg bg-secondary px-2 py-1">
              {IMAGE_TYPE_LABELS[imageType]}
            </span>
            <span className="rounded-lg bg-secondary px-2 py-1">
              {PLATFORM_LABELS[platform]}
            </span>
            <span className="rounded-lg bg-secondary px-2 py-1">
              {size.width} x {size.height}
            </span>
          </div>
          <Button
            onClick={handleDownload}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Download className="h-4 w-4" />
            下载图片
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <span className="text-sm font-medium text-foreground">处理结果</span>
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50">
        <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
        <p className="mt-3 text-sm text-muted-foreground">
          处理后的图片将在此处显示
        </p>
      </div>
    </div>
  );
}
