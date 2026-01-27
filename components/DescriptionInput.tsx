'use client';

import { Textarea } from '@/components/ui/textarea';
import { Sparkles } from 'lucide-react';

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function DescriptionInput({ value, onChange }: DescriptionInputProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">修改描述</span>
        <span className="text-xs text-muted-foreground">建议填写，可提升AI处理效果</span>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="请描述您希望对图片进行的修改，例如：调整背景颜色为白色、添加促销标签、去除水印等..."
        className="min-h-[100px] resize-none border-2 border-border bg-card transition-colors focus:border-primary"
      />
      <div className="flex justify-end">
        <span className="text-xs text-muted-foreground">{value.length} / 500</span>
      </div>
    </div>
  );
}
