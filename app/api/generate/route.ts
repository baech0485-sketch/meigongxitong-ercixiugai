import { NextRequest, NextResponse } from 'next/server';
import { buildModelRequest } from '@/lib/generate-provider';
import { parseModelResponse } from '@/lib/generate-parser';
import { isOssConfigured, uploadGeneratedImageToOSS } from '@/lib/oss-storage';
import type {
  GenerateModelConfig,
  GenerateRequestPayload,
} from '@/lib/generate-contracts';
import type { ModelKey } from '@/types';

export const runtime = 'nodejs';

const MODEL_CONFIGS: Record<ModelKey, GenerateModelConfig> = {
  model1: {
    provider: 'gemini-stream',
    apiUrl: process.env.YUNWU_API_URL || 'https://yunwu.ai',
    apiKey: process.env.YUNWU_API_KEY || '',
    model: process.env.YUNWU_MODEL || 'gemini-3.1-flash-image-preview',
  },
  model2: {
    provider: 'gemini-stream',
    apiUrl: process.env.VECTORENGINE_API_URL || 'https://api.vectorengine.ai',
    apiKey: process.env.VECTORENGINE_API_KEY || '',
    model: process.env.VECTORENGINE_MODEL || 'gemini-3.1-flash-image-preview',
  },
  model3: {
    provider: 'openai-chat',
    apiUrl: process.env.POCKGO_API_URL || 'https://newapi.aicohere.org/v1/chat/completions',
    apiKey: process.env.POCKGO_API_KEY || '',
    model: process.env.POCKGO_MODEL || 'gemini-3.1-flash-image-preview',
  },
};

interface GenerateResponse {
  success: boolean;
  data?: {
    image: string;
    mimeType: string;
    ossUrl?: string;
    storage: 'inline' | 'oss';
  };
  error?: string;
}

function resolveModelKey(selectedModel?: ModelKey): ModelKey {
  if (selectedModel === 'model2' || selectedModel === 'model3') {
    return selectedModel;
  }

  return 'model1';
}

export async function POST(request: NextRequest): Promise<NextResponse<GenerateResponse>> {
  try {
    const body: GenerateRequestPayload = await request.json();
    const { originalImage, referenceImage, description } = body;
    const modelKey = resolveModelKey(body.selectedModel);
    const modelConfig = MODEL_CONFIGS[modelKey];

    if (!modelConfig.apiKey) {
      return NextResponse.json(
        { success: false, error: '模型配置缺少 API Key，请检查环境变量' },
        { status: 500 }
      );
    }

    // 验证必填字段
    if (!originalImage) {
      return NextResponse.json(
        { success: false, error: '请上传原图' },
        { status: 400 }
      );
    }

    const apiRequest = buildModelRequest(modelConfig, {
      ...body,
      referenceImage,
      description,
    });

    const apiResponse = await fetch(apiRequest.url, {
      method: 'POST',
      headers: apiRequest.headers,
      body: apiRequest.body,
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('API Error:', errorText);
      return NextResponse.json(
        { success: false, error: `API请求失败: ${apiResponse.status}` },
        { status: 500 }
      );
    }

    const responseText = await apiResponse.text();
    const responseData = await parseModelResponse(modelConfig.provider, responseText);

    if (!responseData) {
      return NextResponse.json(
        { success: false, error: '无法解析API响应' },
        { status: 500 }
      );
    }

    let finalImage = responseData.image;
    let finalMimeType = responseData.mimeType;
    let ossUrl: string | undefined;
    let storage: 'inline' | 'oss' = 'inline';

    if (isOssConfigured()) {
      try {
        const uploadedImage = await uploadGeneratedImageToOSS({
          image: responseData.image,
          mimeType: responseData.mimeType,
          fallbackFilename: `${modelKey}-${body.imageType}-${body.platform}-${Date.now()}`,
        });

        finalImage = uploadedImage.url;
        finalMimeType = uploadedImage.mimeType;
        ossUrl = uploadedImage.url;
        storage = 'oss';
      } catch (uploadError) {
        console.error('OSS Upload Error:', uploadError);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        image: finalImage,
        mimeType: finalMimeType,
        ossUrl,
        storage,
      },
    });
  } catch (error) {
    console.error('Generate API Error:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

