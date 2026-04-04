'use client';

import type { Platform } from '@/types';
import { WorkbenchChoiceButton } from '@/components/workbench-primitives';

interface PlatformSelectorProps {
  value: Platform | null;
  onChange: (platform: Platform) => void;
}

const platforms: { platform: Platform; label: string; color: string; bgColor: string }[] = [
  {
    platform: 'meituan',
    label: '美团',
    color: 'text-meituan-foreground',
    bgColor: 'bg-meituan'
  },
  {
    platform: 'taobao',
    label: '淘宝闪购',
    color: 'text-taobao-foreground',
    bgColor: 'bg-taobao'
  },
];

export function PlatformSelector({ value, onChange }: PlatformSelectorProps) {
  return (
    <div className="space-y-[10px]">
      <div className="flex items-center gap-2">
        <span className="text-[15px] font-bold text-[#242930]">目标平台</span>
        <span className="text-xs text-[#db574d]">*必选</span>
      </div>
      <div className="flex gap-3">
        {platforms.map(({ platform, label }) => (
          <WorkbenchChoiceButton
            key={platform}
            onClick={() => onChange(platform)}
            active={value === platform}
            className="justify-start"
          >
            <span>{label}</span>
          </WorkbenchChoiceButton>
        ))}
      </div>
    </div>
  );
}
