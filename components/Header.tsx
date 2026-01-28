'use client';

import { Sparkles, Zap, Wand2 } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      {/* 顶部渐变装饰线 */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-4">
          {/* Logo 区域 */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-accent p-3 shadow-lg shadow-primary/20">
              <Wand2 className="h-6 w-6 text-primary-foreground" />
              {/* 光效动画 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
            {/* 在线状态指示器 */}
            <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center">
              <span className="absolute h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-green-500" />
            </div>
          </div>

          {/* 标题区域 */}
          <div>
            <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-lg font-bold text-transparent sm:text-xl">
              美工图片调整系统
            </h1>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
              <Sparkles className="h-3 w-3 text-primary" />
              AI 智能图片处理工具
            </p>
          </div>
        </div>

        {/* 平台标识 */}
        <div className="hidden items-center gap-3 sm:flex">
          <div className="flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-4 py-2 backdrop-blur-sm">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">
              支持美团 / 淘宝闪购
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
