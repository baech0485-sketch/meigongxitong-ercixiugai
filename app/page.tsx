'use client';

import { useCallback, useState } from 'react';
import { Header } from '@/components/Header';
import { ModelSelector } from '@/components/ModelSelector';
import { ImageTypeSelector } from '@/components/ImageTypeSelector';
import { PlatformSelector } from '@/components/PlatformSelector';
import { ImageUploader } from '@/components/ImageUploader';
import { DescriptionInput } from '@/components/DescriptionInput';
import { ResultDisplay } from '@/components/ResultDisplay';
import type { ImageType, ModelKey, Platform } from '@/types';
import { IMAGE_SIZES } from '@/types';
import { generateImage } from '@/lib/api';
import type { GenerateResultData } from '@/lib/api';

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<ModelKey>('model1');
  const [imageType, setImageType] = useState<ImageType | null>('banner');
  const [platform, setPlatform] = useState<Platform | null>('meituan');
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<GenerateResultData | null>(null);

  const resolvedType = imageType ?? 'banner';
  const resolvedPlatform = platform ?? 'meituan';
  const size = IMAGE_SIZES[resolvedType][resolvedPlatform];
  const canSubmit = Boolean(imageType && platform && originalImagePreview);

  const handleOriginalImageChange = useCallback((file: File | null, preview: string | null) => {
    setOriginalImage(file);
    setOriginalImagePreview(preview);
  }, []);

  const handleReferenceImageChange = useCallback((file: File | null, preview: string | null) => {
    setReferenceImage(file);
    setReferenceImagePreview(preview);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || !imageType || !platform || !originalImagePreview) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await generateImage({
        selectedModel,
        imageType,
        platform,
        originalImage: originalImagePreview,
        referenceImage: referenceImagePreview || undefined,
        description: description || '请根据图片进行优化处理',
      });

      if (response.success && response.data) {
        setResultData(response.data);
      } else {
        setResultData(null);
        setError(response.error || '处理失败，请稍后重试');
      }
    } catch (submitError) {
      console.error('Submit error:', submitError);
      setResultData(null);
      setError('网络错误，请检查网络连接后重试');
    } finally {
      setIsLoading(false);
    }
  }, [
    canSubmit,
    description,
    imageType,
    originalImagePreview,
    platform,
    referenceImagePreview,
    selectedModel,
  ]);

  return (
    <div className="min-h-screen bg-[#f8f3ed]">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[rgba(202,221,255,0.7)] blur-3xl" />
        <div className="pointer-events-none absolute left-0 top-20 h-56 w-56 rounded-full bg-[rgba(255,231,205,0.8)] blur-3xl" />

        <div className="mx-auto max-w-[1440px] px-4 pb-8 pt-[26px] sm:px-6 xl:px-8">
          <div className="space-y-6">
            <Header
              imageType={imageType}
              platform={platform}
              isLoading={isLoading}
              error={error}
              resultImage={resultData?.image ?? null}
            />

            <section className="grid gap-7 lg:grid-cols-[minmax(0,966px)_382px] lg:items-start">
              <div className="rounded-[30px] border border-[#e8e0d6] bg-white p-[22px] shadow-[0_10px_28px_rgba(23,18,8,0.06)]">
                <div className="space-y-[18px]">
                  <div className="rounded-3xl border border-[#e5e0d6] bg-[#fbfaf7] p-[18px] shadow-[0_8px_20px_rgba(33,26,13,0.03)]">
                    <div className="space-y-4">
                      <ModelSelector value={selectedModel} onChange={setSelectedModel} />
                      <ImageTypeSelector value={imageType} onChange={setImageType} />
                      <PlatformSelector value={platform} onChange={setPlatform} />

                      <div className="flex items-center justify-between rounded-[18px] border border-[#e8e0d6] bg-[#fbfaf8] px-[18px] py-[18px]">
                        <span className="text-sm text-[#737580]">输出尺寸：</span>
                        <span className="font-mono text-sm font-medium text-[#242930]">
                          {size.width} x {size.height} px
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-[#e5e0d6] bg-[#fbfaf7] p-[18px] shadow-[0_8px_20px_rgba(33,26,13,0.03)]">
                    <div className="grid gap-4 lg:grid-cols-2">
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
                  </div>

                  <div className="rounded-3xl border border-[#e5e0d6] bg-[#fbfaf7] p-[18px] shadow-[0_8px_20px_rgba(33,26,13,0.03)]">
                    <div className="space-y-4">
                      <DescriptionInput value={description} onChange={setDescription} />

                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!canSubmit || isLoading}
                        className="flex h-[60px] w-full items-center gap-[10px] rounded-[20px] border border-[#f29954] bg-[#ed782b] px-5 py-[18px] text-left shadow-[0_10px_24px_rgba(237,120,43,0.18)] transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-[9px] border border-[#e5e0d6] bg-[#f7f5f0]">
                          <span className="font-mono text-sm text-[#5b5650]">▷</span>
                        </span>
                        <span className="text-lg font-bold text-white">
                          {isLoading ? '处理中...' : '发送请求'}
                        </span>
                        <span className="font-mono text-base text-white">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[30px] border border-[#e8e0d6] bg-white p-[22px] shadow-[0_10px_28px_rgba(23,18,8,0.06)] lg:h-full">
                <ResultDisplay
                  resultImage={resultData?.image ?? null}
                  resultOssUrl={resultData?.ossUrl ?? null}
                  resultStorage={resultData?.storage ?? null}
                  isLoading={isLoading}
                  error={error}
                  imageType={imageType}
                  platform={platform}
                  onRetry={handleSubmit}
                />
              </div>
            </section>

            <footer className="rounded-[22px] border border-[#e8e0d6] bg-white px-[18px] py-[18px] shadow-[0_10px_28px_rgba(23,18,8,0.05)]">
              <div className="flex flex-col gap-3 text-xs text-[#737580] sm:flex-row sm:items-center sm:justify-between">
                <span>美工图片二次调整系统 - AI 智能处理工具</span>
                <span>支持平台：美团 / 淘宝闪购</span>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
