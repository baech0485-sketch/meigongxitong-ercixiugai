'use client';

import { SquarePen } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { WorkbenchIconBadge } from '@/components/workbench-primitives';

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function DescriptionInput({ value, onChange }: DescriptionInputProps) {
  return (
    <div className="rounded-[22px] border border-[#e8e0d6] bg-[#fdfdfb] p-5">
      <div className="space-y-[14px]">
        <div className="flex items-start gap-[10px]">
          <WorkbenchIconBadge icon={SquarePen} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-[#242930]">修改描述</span>
              <span className="text-xs text-[#737580]">建议填写，可提升AI处理效果</span>
            </div>
          </div>
        </div>

        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="请描述您希望对图片进行的修改，例如：调整背景颜色为白色、添加促销标签、去除水印等..."
          className="min-h-14 resize-none rounded-[18px] border border-[#e8e0d6] bg-white px-4 py-4 text-sm leading-6 text-[#242930] placeholder:text-[#737580] focus-visible:border-[#cbbfae] focus-visible:ring-0"
        />

        <div className="flex justify-end">
          <span className="text-xs text-[#737580]">{value.length} / 500</span>
        </div>
      </div>
    </div>
  );
}
