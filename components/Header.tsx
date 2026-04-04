'use client';

import { MonitorCheck, Sparkles } from 'lucide-react';
import { IMAGE_SIZES, IMAGE_TYPE_LABELS, PLATFORM_LABELS } from '@/types';
import type { ImageType, Platform } from '@/types';
import { WorkbenchIconBadge, WorkbenchTag } from '@/components/workbench-primitives';

interface HeaderProps {
  imageType: ImageType | null;
  platform: Platform | null;
  isLoading: boolean;
  error: string | null;
  resultImage: string | null;
}

export function Header({
  imageType,
  platform,
  isLoading,
  error,
  resultImage,
}: HeaderProps) {
  const resolvedType = imageType ?? 'banner';
  const resolvedPlatform = platform ?? 'meituan';
  const size = IMAGE_SIZES[resolvedType][resolvedPlatform];

  const statusText = isLoading
    ? 'AI 正在处理图片'
    : error
      ? '处理失败，请重新处理'
      : resultImage
        ? '处理完成，可下载当前图片'
        : '请先完成图片配置';

  return (
    <header className="rounded-[30px] border border-[#e8e0d6] bg-white px-6 py-5 shadow-[0_10px_28px_rgba(23,18,8,0.07)]">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-[14px]">
            <WorkbenchIconBadge
              icon={Sparkles}
              className="h-11 w-11 rounded-[14px]"
              iconClassName="h-5 w-5"
            />
            <h1 className="min-w-0 text-[22px] font-bold leading-none text-[#242930]">
              美工图片调整系统
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <div className="rounded-full border border-[#e3dbcf] bg-[#fbfaf8] px-3 py-[10px] text-[11px] text-[#737580]">
              支持平台：美团 / 淘宝闪购
            </div>
            <WorkbenchTag tone="blue">{IMAGE_TYPE_LABELS[resolvedType]}</WorkbenchTag>
            <WorkbenchTag tone="orange">{PLATFORM_LABELS[resolvedPlatform]}</WorkbenchTag>
            <WorkbenchTag>{`${size.width}×${size.height}`}</WorkbenchTag>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-[20px] border border-[#e8e0d6] bg-[#fbfaf8] px-4 py-[14px]">
          <WorkbenchIconBadge icon={MonitorCheck} />
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-[#242930]">{statusText}</p>
            <p className="text-xs text-[#737580]">
              选择图片类型、目标平台并上传素材后，即可发起 AI 处理。
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
