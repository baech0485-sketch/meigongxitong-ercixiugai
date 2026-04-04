'use client';

import { MonitorCheck } from 'lucide-react';
import { IMAGE_SIZES, IMAGE_TYPE_LABELS, PLATFORM_LABELS } from '@/types';
import type { ImageType, Platform } from '@/types';
import { WorkbenchIconBadge, WorkbenchTag } from '@/components/workbench-primitives';

interface HeroPanelProps {
  imageType: ImageType | null;
  platform: Platform | null;
  isLoading: boolean;
  error: string | null;
  resultImage: string | null;
}

export function HeroPanel({
  imageType,
  platform,
  isLoading,
  error,
  resultImage,
}: HeroPanelProps) {
  const resolvedType = imageType ?? 'banner';
  const resolvedPlatform = platform ?? 'meituan';
  const size = IMAGE_SIZES[resolvedType][resolvedPlatform];

  const statusText = isLoading
    ? 'AI 正在处理图片'
    : error
      ? '处理失败，请重新处理'
      : resultImage
        ? '处理完成，可下载当前图片'
        : '当前为完整流程预览稿';

  const statusDesc = isLoading
    ? '系统正在根据你的选择与描述生成图片'
    : error
      ? '请检查网络或参数后再次发起处理'
      : resultImage
        ? '当前结果已经按选择的平台规格完成输出'
        : '视觉已切换为浅色高级编辑台风格';

  return (
    <section className="flex flex-col gap-6 rounded-[30px] border border-[#e8e0d6] bg-white p-[26px] shadow-[0_10px_28px_rgba(23,18,8,0.07)] lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <p className="font-mono text-xs tracking-[0.08em] text-[#4d78ed]">图片加工工作台</p>
        <h2 className="font-serif text-[42px] font-bold leading-[56px] text-[#242930]">
          更轻盈的界面，
          <br />
          更专注的处理流程。
        </h2>
        <p className="text-[15px] leading-6 text-[#737580]">
          选择图片类型、目标平台并上传素材后，即可发起 AI 处理并下载对应规格的成品图片。
        </p>
      </div>

      <div className="flex w-full max-w-[330px] flex-col gap-[10px]">
        <div className="flex flex-wrap gap-2">
          <WorkbenchTag tone="blue">{IMAGE_TYPE_LABELS[resolvedType]}</WorkbenchTag>
          <WorkbenchTag tone="orange">{PLATFORM_LABELS[resolvedPlatform]}</WorkbenchTag>
          <WorkbenchTag>{`${size.width}×${size.height}`}</WorkbenchTag>
        </div>

        <div className="flex gap-3 rounded-[20px] border border-[#e8e0d6] bg-[#fbfaf8] px-4 py-[14px]">
          <WorkbenchIconBadge icon={MonitorCheck} />
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-[#242930]">{statusText}</p>
            <p className="text-xs text-[#737580]">{statusDesc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
