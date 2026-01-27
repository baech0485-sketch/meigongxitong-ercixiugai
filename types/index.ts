export type ImageType = 'product' | 'avatar' | 'banner' | 'poster';
export type Platform = 'meituan' | 'taobao';

export interface AppState {
  imageType: ImageType | null;
  platform: Platform | null;
  originalImage: File | null;
  originalImagePreview: string | null;
  referenceImage: File | null;
  referenceImagePreview: string | null;
  description: string;
  isLoading: boolean;
  error: string | null;
  resultImage: string | null;
}

export const IMAGE_SIZES = {
  product: {
    meituan: { width: 600, height: 450 },
    taobao: { width: 600, height: 600 },
  },
  avatar: {
    meituan: { width: 800, height: 800 },
    taobao: { width: 800, height: 800 },
  },
  banner: {
    meituan: { width: 692, height: 390 },
    taobao: { width: 750, height: 423 },
  },
  poster: {
    meituan: { width: 720, height: 240 },
    taobao: { width: 2048, height: 600 },
  },
} as const;

export const IMAGE_TYPE_LABELS: Record<ImageType, string> = {
  product: '产品图',
  avatar: '头像',
  banner: '店招',
  poster: '海报',
};

export const PLATFORM_LABELS: Record<Platform, string> = {
  meituan: '美团',
  taobao: '淘宝闪购',
};
