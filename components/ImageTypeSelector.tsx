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
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">图片类型</span>
        <span className="text-xs text-destructive">*必选</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {imageTypes.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={cn(
              'group relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200',
              'hover:border-primary/50 hover:bg-secondary/50',
              value === type
                ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                : 'border-border bg-card'
            )}
          >
            <div
              className={cn(
                'rounded-lg p-2.5 transition-colors',
                value === type
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <span
              className={cn(
                'text-sm font-medium transition-colors',
                value === type ? 'text-primary' : 'text-foreground'
              )}
            >
              {label}
            </span>
            {value === type && (
              <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-primary shadow-lg" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
