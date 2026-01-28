'use client';

import { Package, User, Store, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ImageType } from '@/types';

interface ImageTypeSelectorProps {
  value: ImageType | null;
  onChange: (type: ImageType) => void;
}

const imageTypes: { type: ImageType; label: string; icon: typeof Package }[] = [
  { type: 'product', label: '产品图', icon: Package },
  { type: 'avatar', label: '头像', icon: User },
  { type: 'banner', label: '店招', icon: Store },
  { type: 'poster', label: '海报', icon: ImageIcon },
];

export function ImageTypeSelector({ value, onChange }: ImageTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-foreground">图片类型</span>
        <span className="rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
          必选
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {imageTypes.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={cn(
              'group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-5 transition-all duration-300',
              'hover:-translate-y-1 hover:shadow-lg',
              value === type
                ? 'border-primary bg-gradient-to-b from-primary/15 to-primary/5 shadow-[0_0_30px_rgba(251,191,36,0.2)]'
                : 'border-border bg-card hover:border-primary/40 hover:bg-secondary/30'
            )}
          >
            {/* 图标容器 */}
            <div
              className={cn(
                'relative rounded-xl p-3 transition-all duration-300',
                value === type
                  ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30'
                  : 'bg-secondary text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary'
              )}
            >
              <Icon className={cn(
                'h-6 w-6 transition-transform duration-300',
                'group-hover:scale-110'
              )} />
            </div>

            {/* 标签 */}
            <span
              className={cn(
                'text-sm font-semibold transition-colors duration-200',
                value === type ? 'text-primary' : 'text-foreground'
              )}
            >
              {label}
            </span>

            {/* 选中指示器 */}
            {value === type && (
              <div className="absolute -right-1.5 -top-1.5 animate-bounce-in">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/50">
                  <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}

            {/* 底部光晕 */}
            {value === type && (
              <div className="absolute -bottom-2 left-1/2 h-4 w-3/4 -translate-x-1/2 rounded-full bg-primary/30 blur-xl" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
