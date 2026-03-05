'use client';

import { Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ModelKey } from '@/types';
import { MODEL_LABELS } from '@/types';

interface ModelSelectorProps {
  value: ModelKey;
  onChange: (model: ModelKey) => void;
}

const models: ModelKey[] = ['model1', 'model2'];

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Cpu className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">AI模型</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {models.map((model) => (
          <button
            key={model}
            type="button"
            onClick={() => onChange(model)}
            className={cn(
              'rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all duration-200',
              value === model
                ? 'border-primary bg-primary/10 text-primary shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary/50'
            )}
          >
            {MODEL_LABELS[model]}
          </button>
        ))}
      </div>
    </div>
  );
}
