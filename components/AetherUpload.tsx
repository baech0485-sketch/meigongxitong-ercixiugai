'use client';

import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileImage, Loader2, MousePointer2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { compressImage } from '@/lib/imageCompressor';

interface AetherUploadProps {
  label: string;
  required?: boolean;
  image: File | null;
  preview: string | null;
  onImageChange: (file: File | null, preview: string | null) => void;
  variant?: 'primary' | 'secondary';
}

export function AetherUpload({
  label,
  required = false,
  image,
  preview,
  onImageChange,
  variant = 'primary'
}: AetherUploadProps) {
  const [isCompressing, setIsCompressing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleFileChange = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return;
      setIsCompressing(true);
      try {
        const compressedFile = await compressImage(file, {
          maxWidth: 1920,
          maxHeight: 1920,
          quality: 0.8,
          maxSizeKB: 500,
        });
        const reader = new FileReader();
        reader.onload = () => {
          onImageChange(compressedFile, reader.result as string);
          setIsCompressing(false);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        setIsCompressing(false);
        const reader = new FileReader();
        reader.onload = () => onImageChange(file, reader.result as string);
        reader.readAsDataURL(file);
      }
    },
    [onImageChange]
  );

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
          {label} {required && <span className="text-primary ml-1">•</span>}
        </span>
      </div>

      <motion.div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={cn(
          "relative group cursor-pointer",
          variant === 'primary' ? "w-64 h-64" : "w-48 h-48"
        )}
      >
        {/* Background Glows */}
        <AnimatePresence>
          {isHovering && !preview && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0.2 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute inset-0 bg-primary rounded-full blur-3xl -z-10"
            />
          )}
        </AnimatePresence>

        {/* The Container */}
        <div className={cn(
          "relative w-full h-full rounded-[2.5rem] border-2 border-dashed transition-all duration-700 overflow-hidden flex flex-col items-center justify-center gap-4",
          preview 
            ? "border-primary/50 bg-background shadow-2xl shadow-primary/10" 
            : "border-white/10 bg-secondary/20 hover:border-primary/30 hover:bg-secondary/40",
          isHovering && !preview && "scale-[1.02]"
        )}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            className="absolute inset-0 opacity-0 z-20 cursor-pointer"
          />

          {isCompressing ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="text-xs font-bold text-primary animate-pulse">OPTIMIZING</span>
            </div>
          ) : preview ? (
            <>
              <motion.img
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={preview}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 z-10">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onImageChange(null, null);
                  }}
                  className="bg-white text-black p-3 rounded-full shadow-xl"
                >
                  <X size={20} />
                </motion.button>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Remove</span>
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="absolute inset-0 bg-primary/20 blur-xl rounded-full"
                />
                <div className="relative bg-background/50 p-4 rounded-2xl border border-white/10">
                  <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
              <div className="text-center px-6">
                <p className="text-sm font-bold text-foreground">Drop Image Here</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">or click to browse</p>
              </div>
            </>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2 p-2 bg-background border border-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          <MousePointer2 size={12} className="text-primary" />
        </div>
      </motion.div>
    </div>
  );
}
