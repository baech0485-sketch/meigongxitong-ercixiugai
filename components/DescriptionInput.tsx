'use client';

import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Lightbulb } from 'lucide-react';

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function DescriptionInput({ value, onChange }: DescriptionInputProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-primary/10 p-1.5">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <span className="text-sm font-semibold text-foreground">修改描述</span>
        <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          建议填写
        </span>
      </div>
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="请描述您希望对图片进行的修改，例如：调整背景颜色为白色、添加促销标签、去除水印等..."
          className="min-h-[120px] resize-none rounded-2xl border-2 border-border bg-card pr-4 transition-all duration-200 focus:border-primary focus:shadow-lg focus:shadow-primary/10"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lightbulb className="h-3.5 w-3.5" />
          <span>详细描述可提升AI处理效果</span>
        </div>
        <span className="rounded-md bg-secondary px-2 py-1 font-mono text-xs text-muted-foreground">
          {value.length} / 500
        </span>
      </div>
    </div>
  );
}
