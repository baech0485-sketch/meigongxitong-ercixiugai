'use client';

import { Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ModelKey } from '@/types';
import { MODEL_LABELS } from '@/types';
import { WorkbenchIconBadge } from '@/components/workbench-primitives';

interface ModelSelectorProps {
  value: ModelKey;
  onChange: (model: ModelKey) => void;
}

const models: ModelKey[] = ['model1', 'model2'];

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <div className="space-y-[10px]">
      <div className="flex items-center gap-[10px]">
        <WorkbenchIconBadge icon={Cpu} />
        <span className="text-base font-bold text-[#242930]">AI模型</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {models.map((model) => (
          <button
            key={model}
            type="button"
            onClick={() => onChange(model)}
            className={cn(
              'relative overflow-hidden rounded-[18px] border px-4 py-4 text-left transition-all duration-200',
              value === model
                ? 'border-[#6187f5] bg-[linear-gradient(180deg,#f5f9ff_0%,#eef4ff_100%)] shadow-[0_10px_24px_rgba(97,135,245,0.16)]'
                : 'border-[#e5e0d6] bg-white hover:border-[#d8ccbc] hover:bg-[#fbfaf8]'
            )}
          >
            <span
              className={cn(
                'absolute inset-x-0 top-0 h-[3px]',
                value === model ? 'bg-[#6187f5]' : 'bg-transparent'
              )}
            />

            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={cn(
                    'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] border',
                    value === model
                      ? 'border-[#dbe7ff] bg-white text-[#4d78ed]'
                      : 'border-[#e5e0d6] bg-[#f7f5f0] text-[#5b5650]'
                  )}
                >
                  <Cpu className="h-[18px] w-[18px]" strokeWidth={1.8} />
                </span>

                <div className="min-w-0">
                  <p
                    className={cn(
                      'truncate text-sm',
                      value === model ? 'font-bold text-[#242930]' : 'font-medium text-[#242930]'
                    )}
                  >
                    {MODEL_LABELS[model]}
                  </p>
                  <p className="mt-1 text-xs text-[#737580]">
                    {value === model ? '当前使用' : '点击切换到该模型'}
                  </p>
                </div>
              </div>

              {value === model ? (
                <span className="inline-flex shrink-0 rounded-full border border-[#dbe7ff] bg-white px-2 py-1 text-[11px] font-medium leading-none text-[#4d78ed]">
                  当前
                </span>
              ) : null}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
