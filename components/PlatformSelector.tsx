'use client';

import { cn } from '@/lib/utils';
import type { Platform } from '@/types';

interface PlatformSelectorProps {
  value: Platform | null;
  onChange: (platform: Platform) => void;
}

const platforms: { platform: Platform; label: string; icon: string }[] = [
  { platform: 'meituan', label: '美团', icon: '🟡' },
  { platform: 'taobao', label: '淘宝闪购', icon: '🟠' },
];

export function PlatformSelector({ value, onChange }: PlatformSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-foreground">目标平台</span>
        <span className="rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
          必选
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {platforms.map(({ platform, label, icon }) => {
          const isSelected = value === platform;
          const isMeituan = platform === 'meituan';

          return (
            <button
              key={platform}
              type="button"
              onClick={() => onChange(platform)}
              className={cn(
                'group relative overflow-hidden rounded-2xl border-2 px-6 py-5 font-semibold transition-all duration-300',
                'hover:-translate-y-1 hover:shadow-xl',
                isSelected
                  ? isMeituan
                    ? 'border-meituan bg-gradient-to-br from-meituan to-meituan/80 text-meituan-foreground glow-meituan'
                    : 'border-taobao bg-gradient-to-br from-taobao to-taobao/80 text-taobao-foreground glow-taobao'
                  : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary/30'
              )}
            >
              {/* 内容 */}
              <div className="relative z-10 flex items-center justify-center gap-2">
                <span className="text-lg">{icon}</span>
                <span className="text-base">{label}</span>
              </div>

              {/* 选中时的光效 */}
              {isSelected && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                  <div className="absolute -bottom-4 left-1/2 h-8 w-1/2 -translate-x-1/2 rounded-full bg-white/30 blur-xl" />
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
