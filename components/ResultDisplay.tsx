'use client';

import { useState } from 'react';
import { Download, RefreshCw, CheckCircle, ImageIcon, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
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

      // 填充白色背景
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size.width, size.height);
      ctx.drawImage(img, 0, 0, size.width, size.height);

      // 使用兼容 Web/Tauri 的下载函数
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
        <div className="flex items-center gap-2">
          <div className="relative">
            <Sparkles className="h-4 w-4 text-primary" />
            <div className="absolute inset-0 animate-ping">
              <Sparkles className="h-4 w-4 text-primary opacity-50" />
            </div>
          </div>
          <span className="text-sm font-semibold text-foreground">AI 正在处理...</span>
        </div>
        <div className="overflow-hidden rounded-2xl border-2 border-primary/20 bg-card">
          {/* 骨架屏动画 */}
          <div className="relative h-64 w-full animate-shimmer" />
          {/* 中心加载指示器 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="relative">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 rounded-xl bg-secondary/50 py-3 text-sm text-muted-foreground">
          <div className="flex gap-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: '0ms' }} />
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: '150ms' }} />
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: '300ms' }} />
          </div>
          <span>预计需要 10-30 秒</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-semibold">处理失败</span>
        </div>
        <div className="rounded-2xl border-2 border-destructive/30 bg-gradient-to-b from-destructive/5 to-destructive/10 p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <p className="text-sm font-medium text-destructive">{error}</p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-4 gap-2 border-destructive/30 bg-transparent hover:bg-destructive/10"
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
          <span className="text-sm font-semibold">处理完成</span>
        </div>
        <div className="overflow-hidden rounded-2xl border-2 border-primary/30 bg-card shadow-lg shadow-primary/10">
          <img
            src={resultImage || "/placeholder.svg"}
            alt="Result"
            className="w-full object-contain"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground">
            {IMAGE_TYPE_LABELS[imageType]}
          </span>
          <span className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground">
            {PLATFORM_LABELS[platform]}
          </span>
          <span className="rounded-lg bg-secondary px-3 py-1.5 font-mono text-xs font-medium text-muted-foreground">
            {size.width} × {size.height}
          </span>
        </div>
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full gap-2 bg-gradient-to-r from-primary to-accent py-5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-70"
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              下载中...
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              下载图片
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <span className="text-sm font-semibold text-foreground">处理结果</span>
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-gradient-to-b from-card to-secondary/30">
        <div className="rounded-2xl bg-secondary/50 p-4">
          <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <p className="mt-4 text-sm font-medium text-muted-foreground">
          处理后的图片将在此处显示
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          请先上传图片并点击发送请求
        </p>
      </div>
    </div>
  );
}
