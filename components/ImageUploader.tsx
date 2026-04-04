'use client';

import React from "react"
import { useCallback, useEffect, useRef, useState } from 'react';
import { Image as ImageIcon, Images, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { compressImage } from '@/lib/imageCompressor';
import { WorkbenchIconBadge } from '@/components/workbench-primitives';

interface ImageUploaderProps {
  label: string;
  required?: boolean;
  image: File | null;
  preview: string | null;
  onImageChange: (file: File | null, preview: string | null) => void;
}

export function ImageUploader({
  label,
  required = false,
  image,
  preview,
  onImageChange,
}: ImageUploaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isPasteTarget, setIsPasteTarget] = useState(false);
  const isReference = label.includes('参考');
  const Icon = isReference ? Images : Upload;

  const handleFileChange = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        alert('请上传图片文件');
        return;
      }

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
        reader.onerror = () => {
          setIsCompressing(false);
          alert('图片读取失败');
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        setIsCompressing(false);
        console.error('压缩失败:', error);
        const reader = new FileReader();
        reader.onload = () => {
          onImageChange(file, reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageChange]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileChange(file);
      e.target.value = '';
    },
    [handleFileChange]
  );

  const handleClear = useCallback(() => {
    onImageChange(null, null);
  }, [onImageChange]);

  const handleOpenFileDialog = useCallback(() => {
    inputRef.current?.click();
    containerRef.current?.focus();
  }, []);

  const handleContainerPaste = useCallback(
    (e: ClipboardEvent | React.ClipboardEvent<HTMLDivElement>) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault?.();
            handleFileChange(file);
            break;
          }
        }
      }
    },
    [handleFileChange]
  );

  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      if (isPasteTarget) {
        handleContainerPaste(e);
      }
    };

    document.addEventListener('paste', handleGlobalPaste);
    return () => {
      document.removeEventListener('paste', handleGlobalPaste);
    };
  }, [handleContainerPaste, isPasteTarget]);

  return (
    <div
      ref={containerRef}
      className="rounded-[22px] border border-[#e8e0d6] bg-[#fdfdfb] p-[18px]"
      tabIndex={0}
      onFocus={() => setIsPasteTarget(true)}
      onBlur={() => setIsPasteTarget(false)}
      onMouseEnter={() => setIsPasteTarget(true)}
      onMouseLeave={() => setIsPasteTarget(false)}
      onPaste={handleContainerPaste}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && !preview) {
          event.preventDefault();
          handleOpenFileDialog();
        }
      }}
    >
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <WorkbenchIconBadge icon={Icon} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#242930]">{label}</span>
              {required ? (
                <span className="text-xs text-[#db574d]">*必填</span>
              ) : (
                <span className="text-xs text-[#737580]">可选</span>
              )}
            </div>
          </div>
        </div>

        <div
          className={`group relative overflow-hidden rounded-[18px] border border-[#e8e0d6] bg-white p-[14px] ${
            !preview ? 'cursor-pointer hover:border-[#d8ccbc]' : ''
          }`}
          onClick={() => {
            if (!preview) handleOpenFileDialog();
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="sr-only"
          />

          {isCompressing ? (
            <div className="flex h-[100px] items-center justify-center">
              <div className="flex items-center gap-3 text-[#737580]">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">正在压缩图片...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="relative overflow-hidden rounded-[14px] bg-[#f5f1e7]">
                {preview ? (
                  <img src={preview} alt="图片预览" className="h-[100px] w-full object-contain" />
                ) : (
                  <div className="flex h-[100px] items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-[#c8bfa8]" strokeWidth={1.7} />
                  </div>
                )}
              </div>

              {preview ? (
                <div className="absolute right-5 top-5">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleClear();
                    }}
                    className="h-8 w-8 rounded-full border-[#e8e0d6] bg-white text-[#5b5650] shadow-sm hover:bg-[#fbfaf8]"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : null}

              <div className="mt-[10px] space-y-1">
                <p className="text-[13px] font-medium text-[#242930]">点击上传或 Ctrl+V 粘贴</p>
                <p className="text-xs text-[#737580]">支持 JPG, PNG, WebP（自动压缩）</p>
                {image?.name ? <p className="truncate text-xs text-[#737580]">{image.name}</p> : null}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
