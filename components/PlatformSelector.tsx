'use client';

import { cn } from '@/lib/utils';
import type { Platform } from '@/types';

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
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">目标平台</span>
        <span className="text-xs text-destructive">*必选</span>
      </div>
      <div className="flex gap-3">
        {platforms.map(({ platform, label, color, bgColor }) => (
          <button
            key={platform}
            type="button"
            onClick={() => onChange(platform)}
            className={cn(
              'group relative flex-1 rounded-xl border-2 px-6 py-4 font-semibold transition-all duration-200',
              value === platform
                ? `${bgColor} ${color} border-transparent shadow-lg`
                : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary/50'
            )}
          >
            <span className="relative z-10">{label}</span>
            {value === platform && (
              <div className="absolute inset-0 rounded-xl opacity-20 blur-xl" 
                   style={{ background: platform === 'meituan' ? '#FBBF24' : '#F97316' }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
