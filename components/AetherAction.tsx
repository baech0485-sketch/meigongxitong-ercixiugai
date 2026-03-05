'use client';

import { motion } from 'framer-motion';
import { Send, Sparkles, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AetherActionProps {
  description: string;
  onDescriptionChange: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export function AetherAction({
  description,
  onDescriptionChange,
  onSubmit,
  isLoading,
  disabled
}: AetherActionProps) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 mt-12">
      {/* Description Area */}
      <div className="relative group">
        <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Describe your creative vision..."
          className="w-full h-32 bg-secondary/30 aether-glass border-white/5 rounded-[2rem] p-8 text-lg font-medium focus:ring-2 ring-primary/20 outline-none transition-all resize-none placeholder:text-muted-foreground/50"
        />
        <div className="absolute bottom-4 right-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          <Sparkles size={12} className="text-primary" />
          AI Enhancement Ready
        </div>
      </div>

      {/* The Core Button */}
      <div className="flex justify-center">
        <motion.button
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
          onClick={onSubmit}
          disabled={disabled || isLoading}
          className={cn(
            "relative group flex items-center gap-4 px-12 py-6 rounded-full overflow-hidden transition-all duration-500",
            disabled 
              ? "bg-secondary/50 text-muted-foreground cursor-not-allowed border border-white/5" 
              : "bg-primary text-primary-foreground shadow-[0_0_50px_rgba(34,211,238,0.3)] hover:shadow-[0_0_80px_rgba(34,211,238,0.5)]"
          )}
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span className="font-black uppercase tracking-[0.3em] text-lg">Processing</span>
            </div>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
              <Wand2 size={24} className={cn("transition-transform duration-500", !disabled && "group-hover:rotate-12")} />
              <span className="font-black uppercase tracking-[0.3em] text-lg">Generate Vision</span>
              <Send size={20} className={cn("transition-all duration-500", !disabled && "group-hover:translate-x-2 group-hover:-translate-y-1")} />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
