'use client';

import { useState, useCallback } from 'react';
import { Send, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { ImageTypeSelector } from '@/components/ImageTypeSelector';
import { PlatformSelector } from '@/components/PlatformSelector';
import { ImageUploader } from '@/components/ImageUploader';
import { DescriptionInput } from '@/components/DescriptionInput';
import { ResultDisplay } from '@/components/ResultDisplay';
import type { ImageType, Platform } from '@/types';
import { IMAGE_SIZES } from '@/types';
import { generateImage } from '@/lib/api';

export default function Home() {
  const [imageType, setImageType] = useState<ImageType | null>(null);
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const canSubmit = imageType && platform && originalImage;

  const handleOriginalImageChange = useCallback(
    (file: File | null, preview: string | null) => {
      setOriginalImage(file);
      setOriginalImagePreview(preview);
    },
    []
  );

  const handleReferenceImageChange = useCallback(
    (file: File | null, preview: string | null) => {
      setReferenceImage(file);
      setReferenceImagePreview(preview);
    },
    []
  );

  const handleSubmit = async () => {
    if (!canSubmit || !originalImagePreview) return;

    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const response = await generateImage({
        imageType,
        platform,
        originalImage: originalImagePreview,
        referenceImage: referenceImagePreview || undefined,
        description: description || '请根据图片进行优化处理',
      });

      if (response.success && response.data) {
        setResultImage(response.data.image);
      } else {
        setError(response.error || '处理失败，请稍后重试');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('网络错误，请检查网络连接后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    handleSubmit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Header />

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <div className="glass-card rounded-3xl p-6 shadow-xl sm:p-8">
              <div className="space-y-8">
                {/* Image Type Selection */}
                <ImageTypeSelector value={imageType} onChange={setImageType} />

                {/* Platform Selection */}
                <PlatformSelector value={platform} onChange={setPlatform} />

                {/* Size Preview */}
                {imageType && platform && (
                  <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-secondary/50 to-secondary/30 p-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">输出尺寸</span>
                    </div>
                    <span className="rounded-lg bg-background/80 px-3 py-1.5 font-mono text-sm font-semibold text-foreground shadow-sm">
                      {IMAGE_SIZES[imageType][platform].width} × {IMAGE_SIZES[imageType][platform].height} px
                    </span>
                  </div>
                )}

                {/* Image Upload Section */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <ImageUploader
                    label="原图上传"
                    required
                    image={originalImage}
                    preview={originalImagePreview}
                    onImageChange={handleOriginalImageChange}
                  />
                  <ImageUploader
                    label="参考图上传"
                    image={referenceImage}
                    preview={referenceImagePreview}
                    onImageChange={handleReferenceImageChange}
                  />
                </div>

                {/* Description Input */}
                <DescriptionInput value={description} onChange={setDescription} />

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isLoading}
                  className="group w-full gap-3 bg-gradient-to-r from-primary to-accent py-7 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      处理中...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      发送请求
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Result */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="glass-card rounded-3xl p-6 shadow-xl">
              <ResultDisplay
                resultImage={resultImage}
                isLoading={isLoading}
                error={error}
                imageType={imageType}
                platform={platform}
                onRetry={handleRetry}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-border/50 bg-gradient-to-b from-card/30 to-background py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm font-medium text-muted-foreground">
              美工图片二次调整系统 - AI 智能处理工具
            </p>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-meituan/10 px-3 py-1 text-xs font-medium text-meituan">
                美团
              </span>
              <span className="rounded-full bg-taobao/10 px-3 py-1 text-xs font-medium text-taobao">
                淘宝闪购
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
