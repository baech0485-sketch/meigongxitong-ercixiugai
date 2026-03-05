'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, RefreshCw, AlertCircle, Share2, Sparkles, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadCanvasAsImage } from '@/lib/downloadHelper';
import type { ImageType, Platform } from '@/types';
import { IMAGE_SIZES } from '@/types';

interface AetherResultProps {
  resultImage: string | null;
  isLoading: boolean;
  error: string | null;
  imageType: ImageType | null;
  platform: Platform | null;
  onRetry: () => void;
}

export function AetherResult({
  resultImage,
  isLoading,
  error,
  imageType,
  platform,
  onRetry,
}: AetherResultProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!resultImage || !imageType || !platform) return;

    setIsDownloading(true);
    const size = IMAGE_SIZES[imageType][platform];

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = size.width;
      canvas.height = size.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsDownloading(false);
        return;
      }

      // Fill background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size.width, size.height);

      // 计算居中绘制位置，保持图片比例
      const imgRatio = img.width / img.height;
      const canvasRatio = size.width / size.height;
      let drawWidth, drawHeight, drawX, drawY;

      if (imgRatio > canvasRatio) {
        // 图片更宽，以宽度为准
        drawWidth = size.width;
        drawHeight = size.width / imgRatio;
        drawX = 0;
        drawY = (size.height - drawHeight) / 2;
      } else {
        // 图片更高，以高度为准
        drawHeight = size.height;
        drawWidth = size.height * imgRatio;
        drawX = (size.width - drawWidth) / 2;
        drawY = 0;
      }

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

      const timestamp = Date.now();
      const filename = `${imageType}_${platform}_${timestamp}.jpg`;
      await downloadCanvasAsImage(canvas, filename, 'image/jpeg', 0.92);
      setIsDownloading(false);
    };
    img.onerror = () => {
      setIsDownloading(false);
      alert('Failed to load image for processing');
    };
    img.src = resultImage;
  };

  return (
    <div className="w-full mt-24">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative">
              <div className="w-32 h-32 border-2 border-primary/20 rounded-full animate-[spin_3s_linear_infinite]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary animate-pulse" />
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-primary blur-3xl rounded-full -z-10"
              />
            </div>
            <h3 className="mt-8 text-xl font-black uppercase tracking-[0.4em] text-primary">Manifesting Reality</h3>
            <p className="mt-2 text-sm text-muted-foreground font-medium italic">The AI is weaving your creative intent...</p>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aether-glass border-destructive/20 p-12 rounded-[3rem] text-center max-w-2xl mx-auto"
          >
            <div className="bg-destructive/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="text-destructive w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black mb-4">Transmission Interrupted</h3>
            <p className="text-muted-foreground mb-8">{error}</p>
            <Button 
              onClick={onRetry}
              className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8 py-6 font-bold uppercase tracking-widest text-xs"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Connection
            </Button>
          </motion.div>
        ) : resultImage ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 rounded-[4rem] blur-2xl opacity-50" />
              <div className="relative aether-glass border-white/10 p-4 rounded-[3.5rem] shadow-2xl overflow-hidden">
                <div className="aspect-[4/3] w-full rounded-[2.5rem] overflow-hidden bg-black/20">
                  <img
                    src={resultImage}
                    alt="AI Result"
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="absolute top-8 right-8 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-black/40 backdrop-blur-md border border-white/10 text-white p-3 rounded-full hover:bg-black/60 transition-all"
                  >
                    <Share2 size={20} />
                  </motion.button>
                </div>
              </div>

              <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 px-8">
                <div className="flex flex-col items-center md:items-start gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Artifact Generated</span>
                  </div>
                  <h4 className="text-3xl font-black tracking-tighter uppercase">SUCCESSFULLY EXPORTED</h4>
                  <p className="text-sm text-muted-foreground font-medium">
                    Optimized for {platform === 'meituan' ? 'Meituan' : 'Taobao'} • {imageType} format
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="group relative flex items-center gap-4 bg-foreground text-background px-12 py-6 rounded-full font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all disabled:opacity-50"
                >
                  {isDownloading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Download className="group-hover:translate-y-1 transition-transform" />
                  )}
                  {isDownloading ? 'Processing' : 'Download Asset'}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/5 rounded-[4rem]"
          >
            <div className="bg-secondary/30 p-8 rounded-full mb-6">
              <ImageIcon className="w-12 h-12 text-muted-foreground" />
            </div>
            <p className="text-xl font-bold text-muted-foreground uppercase tracking-[0.2em]">Awaiting Creation</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}