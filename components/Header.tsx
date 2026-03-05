'use client';

import { Sparkles, Zap } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="rounded-xl bg-primary p-2 shadow-lg">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-green-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground sm:text-xl">
              美工图片调整系统
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              AI 智能图片处理工具
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-full bg-secondary px-3 py-1.5 sm:flex">
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">
            支持美团 / 淘宝闪购
          </span>
        </div>
      </div>
    </header>
  );
}
