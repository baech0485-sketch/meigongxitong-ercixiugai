'use client';

import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  CheckCircle2,
  Download,
  Loader2,
  AlertCircle,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import type { ImageType, Platform } from '@/types';
import { IMAGE_SIZES, IMAGE_TYPE_LABELS, PLATFORM_LABELS } from '@/types';
import { downloadCanvasAsImage } from '@/lib/downloadHelper';
import { WorkbenchIconBadge, WorkbenchTag } from '@/components/workbench-primitives';

interface ResultDisplayProps {
  resultImage: string | null;
  resultOssUrl?: string | null;
  resultStorage?: 'inline' | 'oss' | null;
  isLoading: boolean;
  error: string | null;
  imageType: ImageType | null;
  platform: Platform | null;
  onRetry?: () => void;
}

export function ResultDisplay({
  resultImage,
  resultOssUrl,
  resultStorage,
  isLoading,
  error,
  imageType,
  platform,
  onRetry,
}: ResultDisplayProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const resolvedType = imageType ?? 'banner';
  const resolvedPlatform = platform ?? 'meituan';

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

  const size = IMAGE_SIZES[resolvedType][resolvedPlatform];
  const statusIcon = error ? AlertCircle : isLoading ? Sparkles : CheckCircle2;
  const statusText = error ? '处理失败' : isLoading ? '处理中...' : '处理完成';

  return (
    <div className="flex h-full flex-col gap-[18px]">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <StatusIcon icon={statusIcon} />
          <span className="text-sm font-medium text-[#242930]">{statusText}</span>
        </div>
        <h3 className="font-serif text-[30px] font-bold text-[#242930]">处理结果</h3>
      </div>

      <div className="rounded-[24px] border border-[#e8e0d6] bg-[#fdfdfb] p-[14px]">
        <div className="overflow-hidden rounded-[16px] bg-[#f5f1e7]">
          {resultImage ? (
            <img src={resultImage} alt="处理结果" className="h-[336px] w-full object-contain" />
          ) : (
            <div className="h-[336px] w-full" />
          )}
        </div>

        <div className="mt-[14px] flex flex-wrap gap-2">
          <WorkbenchTag>{IMAGE_TYPE_LABELS[resolvedType]}</WorkbenchTag>
          <WorkbenchTag>{PLATFORM_LABELS[resolvedPlatform]}</WorkbenchTag>
          <WorkbenchTag>{`${size.width} × ${size.height}`}</WorkbenchTag>
          {resultStorage ? (
            <WorkbenchTag tone={resultStorage === 'oss' ? 'blue' : 'neutral'}>
              {resultStorage === 'oss' ? '阿里云OSS' : '内联返回'}
            </WorkbenchTag>
          ) : null}
        </div>

        {resultOssUrl ? (
          <div className="mt-3 rounded-[14px] border border-[#e8e0d6] bg-white px-3 py-3">
            <p className="text-[11px] font-medium text-[#5b5650]">OSS 图片地址</p>
            <a
              href={resultOssUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block truncate text-xs text-[#4d78ed] underline-offset-2 hover:underline"
              title={resultOssUrl}
            >
              {resultOssUrl}
            </a>
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={error ? onRetry : handleDownload}
        disabled={isLoading || (!error && !resultImage) || isDownloading}
        className="flex h-[58px] items-center gap-[10px] rounded-[18px] border border-[#789ef7] bg-[#4d78ed] px-[18px] py-[14px] text-left shadow-[0_10px_24px_rgba(77,120,237,0.18)] transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      >
        <WorkbenchIconBadge
          icon={error ? RefreshCw : isDownloading ? Loader2 : Download}
          className="border-[#e5e0d6] bg-[#f7f5f0]"
          iconClassName={isDownloading ? 'animate-spin text-[#5b5650]' : 'text-[#5b5650]'}
        />
        <span className="text-base font-bold text-white">
          {error ? '重新处理' : isDownloading ? '下载中...' : '下载图片'}
        </span>
        <span className="font-mono text-base text-white">→</span>
      </button>

      <div className="rounded-[20px] border border-[#e8e0d6] bg-[#fdfdfb] p-[14px]">
        <p className="text-sm font-bold text-[#242930]">结果展示区域</p>
        <p className="mt-2 text-[11px] leading-5 text-[#737580]">
          {error
            ? error
            : isLoading
              ? '当前正在处理中，预计需要 10-30 秒，请耐心等待生成完成。'
              : '当前示例展示的是“处理完成”状态。实际项目中还包含处理中、处理失败和重新处理等状态。'}
        </p>
      </div>
    </div>
  );
}

function StatusIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="inline-flex h-3 w-3 items-center justify-center text-[#5b5650]">
      <Icon className="h-3 w-3" strokeWidth={1.8} />
    </span>
  );
}
