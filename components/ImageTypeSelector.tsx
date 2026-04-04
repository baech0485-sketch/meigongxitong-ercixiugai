'use client';

import { Package, User, Store, ImageIcon } from 'lucide-react';
import type { ImageType } from '@/types';
import { WorkbenchChoiceButton } from '@/components/workbench-primitives';

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
    <div className="space-y-[10px]">
      <div className="flex items-center gap-2">
        <span className="text-[15px] font-bold text-[#242930]">图片类型</span>
        <span className="text-xs text-[#db574d]">*必选</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {imageTypes.map(({ type, label, icon: Icon }) => (
          <WorkbenchChoiceButton
            key={type}
            onClick={() => onChange(type)}
            active={value === type}
            className="justify-start"
          >
            <Icon className="h-4 w-4 text-[#5b5650]" strokeWidth={1.8} />
            <span>{label}</span>
          </WorkbenchChoiceButton>
        ))}
      </div>
    </div>
  );
}
