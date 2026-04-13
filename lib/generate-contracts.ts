export type GenerateProvider = 'gemini-stream' | 'openai-chat';

export interface GenerateModelConfig {
  provider: GenerateProvider;
  apiUrl: string;
  apiKey: string;
  model: string;
}

export interface GenerateRequestPayload {
  selectedModel?: 'model1' | 'model2' | 'model3';
  imageType: 'product' | 'avatar' | 'banner' | 'poster';
  platform: 'meituan' | 'taobao';
  originalImage: string;
  referenceImage?: string;
  description: string;
}

export interface BuiltModelRequest {
  url: string;
  headers: Record<string, string>;
  body: string;
}

export interface ParsedImageData {
  image: string;
  mimeType: string;
}
