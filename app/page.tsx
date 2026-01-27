'use client';

import { useState, useCallback } from 'react';
import { Send, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { ImageTypeSelector } from '@/components/ImageTypeSelector';
import { PlatformSelector } from '@/components/PlatformSelector';
import { ImageUploader } from '@/components/ImageUploader';
import { DescriptionInput } from '@/components/DescriptionInput';
import { ResultDisplay } from '@/components/ResultDisplay';
import type { ImageType, Platform } from '@/types';
import { IMAGE_SIZES, IMAGE_TYPE_LABELS, PLATFORM_LABELS } from '@/types';
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
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <Card className="border-2 border-border bg-card p-6">
              <div className="space-y-8">
                {/* Image Type Selection */}
                <ImageTypeSelector value={imageType} onChange={setImageType} />

                {/* Platform Selection */}
                <PlatformSelector value={platform} onChange={setPlatform} />

                {/* Size Preview */}
                {imageType && platform && (
                  <div className="rounded-lg bg-secondary/50 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">输出尺寸：</span>
                      <span className="font-mono font-medium text-foreground">
                        {IMAGE_SIZES[imageType][platform].width} x{' '}
                        {IMAGE_SIZES[imageType][platform].height} px
                      </span>
                    </div>
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
                  className="w-full gap-2 bg-primary py-6 text-lg font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50"
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
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column - Result */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <Card className="border-2 border-border bg-card p-6">
              <ResultDisplay
                resultImage={resultImage}
                isLoading={isLoading}
                error={error}
                imageType={imageType}
                platform={platform}
                onRetry={handleRetry}
              />
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-6">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              美工图片二次调整系统 - AI 智能处理工具
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>支持平台：美团 / 淘宝闪购</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
