'use client';

import { motion } from 'framer-motion';
import { Package, User, Store, ImageIcon, Monitor, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ImageType, Platform } from '@/types';

interface BentoSelectorProps {
  imageType: ImageType | null;
  onImageTypeChange: (type: ImageType) => void;
  platform: Platform | null;
  onPlatformChange: (platform: Platform) => void;
}

const imageTypes = [
  { type: 'product', label: '产品图', icon: Package, description: '适配商品主图' },
  { type: 'avatar', label: '头像', icon: User, description: '店铺品牌头像' },
  { type: 'banner', label: '店招', icon: Store, description: '店铺首页招牌' },
  { type: 'poster', label: '海报', icon: ImageIcon, description: '活动营销宣传' },
] as const;

const platforms = [
  { platform: 'meituan', label: '美团', icon: Monitor, color: 'text-meituan' },
  { platform: 'taobao', label: '淘宝闪购', icon: ShoppingBag, color: 'text-taobao' },
] as const;

export function BentoSelector({
  imageType,
  onImageTypeChange,
  platform,
  onPlatformChange,
}: BentoSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {/* Image Types - Takes 2 columns on medium screens */}
      <div className="md:col-span-2 grid grid-cols-2 gap-3">
        {imageTypes.map(({ type, label, icon: Icon, description }) => (
          <motion.button
            key={type}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onImageTypeChange(type)}
            className={cn(
              "relative flex flex-col items-start p-5 rounded-3xl transition-all duration-500 overflow-hidden",
              imageType === type 
                ? "aether-glass border-primary/50 ring-2 ring-primary/20 shadow-primary/20" 
                : "bg-secondary/40 border border-white/5 hover:bg-secondary/60"
            )}
          >
            <div className={cn(
              "p-3 rounded-2xl mb-4 transition-colors duration-300",
              imageType === type ? "bg-primary text-primary-foreground" : "bg-background/50 text-muted-foreground"
            )}>
              <Icon size={24} />
            </div>
            <span className="font-bold text-lg mb-1">{label}</span>
            <span className="text-xs text-muted-foreground">{description}</span>
            
            {imageType === type && (
              <motion.div 
                layoutId="type-active"
                className="absolute inset-0 bg-primary/5 -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Platforms - Takes 1 column */}
      <div className="flex flex-col gap-3">
        {platforms.map(({ platform: p, label, icon: Icon, color }) => (
          <motion.button
            key={p}
            whileHover={{ x: 4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPlatformChange(p)}
            className={cn(
              "relative flex items-center gap-4 p-6 rounded-3xl transition-all duration-500 h-full",
              platform === p 
                ? "aether-glass border-primary/50 ring-2 ring-primary/20" 
                : "bg-secondary/40 border border-white/5 hover:bg-secondary/60"
            )}
          >
            <div className={cn(
              "p-4 rounded-full transition-all duration-500",
              platform === p ? "bg-primary text-primary-foreground rotate-0" : "bg-background/50 text-muted-foreground -rotate-12"
            )}>
              <Icon size={28} />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-bold text-xl">{label}</span>
              <span className={cn("text-xs font-medium opacity-80", color)}>
                {p === 'meituan' ? 'Meituan' : 'Taobao'}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
