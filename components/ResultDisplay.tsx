'use client';

import { useState } from 'react';
import { Download, RefreshCw, CheckCircle, ImageIcon, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ImageType, Platform } from '@/types';
import { IMAGE_SIZES, IMAGE_TYPE_LABELS, PLATFORM_LABELS } from '@/types';
import { downloadCanvasAsImage } from '@/lib/downloadHelper';

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
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!resultImage || !imageType || !platform) return;

    setIsDownloading(true);
    const size = IMAGE_SIZES[imageType][platform];

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = size.width;
      canvas.height = size.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsDownloading(false);
        return;
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size.width, size.height);
      ctx.drawImage(img, 0, 0, size.width, size.height);

      const timestamp = Date.now();
      const filename = `${imageType}_${platform}_${timestamp}.jpg`;
      await downloadCanvasAsImage(canvas, filename, 'image/jpeg', 0.92);
      setIsDownloading(false);
    };
    img.onerror = () => {
      setIsDownloading(false);
      alert('图片加载失败');
    };
    img.src = resultImage;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <span className="text-sm font-medium text-foreground">处理中...</span>
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-primary/20 bg-card">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="mt-4 text-sm text-muted-foreground">AI 正在处理图片...</p>
          <p className="mt-1 text-xs text-muted-foreground">预计需要 10-30 秒</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-medium">处理失败</span>
        </div>
        <div className="rounded-xl border-2 border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">{error}</p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-4 gap-2"
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
        <div className="overflow-hidden rounded-xl border-2 border-primary/30 bg-card">
          <img
            src={resultImage}
            alt="Result"
            className="w-full object-contain"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded bg-secondary px-2 py-1">
            {IMAGE_TYPE_LABELS[imageType]}
          </span>
          <span className="rounded bg-secondary px-2 py-1">
            {PLATFORM_LABELS[platform]}
          </span>
          <span className="rounded bg-secondary px-2 py-1 font-mono">
            {size.width} × {size.height}
          </span>
        </div>
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full gap-2"
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              下载中...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              下载图片
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <span className="text-sm font-medium text-foreground">处理结果</span>
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card">
        <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
        <p className="mt-4 text-sm text-muted-foreground">
          处理后的图片将在此处显示
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          请先上传图片并点击发送请求
        </p>
      </div>
    </div>
  );
}
