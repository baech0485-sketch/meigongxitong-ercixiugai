'use client';

import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconBadgeProps {
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
}

export function WorkbenchIconBadge({
  icon: Icon,
  className,
  iconClassName,
}: IconBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#e5e0d6] bg-[#f7f5f0]',
        className
      )}
    >
      <Icon className={cn('h-[18px] w-[18px] text-[#5b5650]', iconClassName)} strokeWidth={1.8} />
    </span>
  );
}

interface ChoiceButtonProps {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export function WorkbenchChoiceButton({
  active = false,
  onClick,
  children,
  className,
}: ChoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex min-h-12 flex-1 items-center gap-2 rounded-2xl border px-4 py-3 text-left text-sm text-[#242930] transition-all duration-200',
        active
          ? 'border-[#6187f5] bg-[#f2f7ff] shadow-[0_6px_18px_rgba(97,135,245,0.12)]'
          : 'border-[#e5e0d6] bg-white hover:border-[#d8ccbc] hover:bg-[#fbfaf8]',
        className
      )}
    >
      {active ? <span className="h-2 w-2 rounded-full bg-[#4d78ed]" /> : null}
      <span className={cn(active ? 'font-bold' : 'font-medium')}>{children}</span>
    </button>
  );
}

interface TagProps {
  children: ReactNode;
  tone?: 'blue' | 'orange' | 'neutral';
}

export function WorkbenchTag({ children, tone = 'neutral' }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-[10px] py-[6px] text-[11px] font-medium leading-none',
        tone === 'blue' && 'border-[#dbe7ff] bg-[#f2f7ff] text-[#4d78ed]',
        tone === 'orange' && 'border-[#f4dbc8] bg-[#fff5ed] text-[#ed782b]',
        tone === 'neutral' && 'border-[#e3dbcf] bg-[#fbfaf8] text-[#737580]'
      )}
    >
      {children}
    </span>
  );
}
