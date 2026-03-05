import { NextRequest, NextResponse } from 'next/server';

// 解析流式响应，提取图片数据
function parseStreamResponse(responseText: string): { image: string; mimeType: string } | null {
  try {
    // 流式响应可能包含多个JSON对象，用换行分隔
    const lines = responseText.split('\n').filter(line => line.trim());

    for (const line of lines) {
      try {
        const json = JSON.parse(line);
        // 查找包含图片的部分 - 注意使用 inlineData（驼峰命名）
        const candidates = json.candidates || [];
        for (const candidate of candidates) {
          const parts = candidate?.content?.parts || [];
          for (const part of parts) {
            if (part.inlineData) {
              return {
                image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
                mimeType: part.inlineData.mimeType,
              };
            }
          }
        }
      } catch {
        // 单行解析失败，继续尝试下一行
        continue;
      }
    }

    // 尝试作为单个JSON解析
    const json = JSON.parse(responseText);
    const candidates = json.candidates || [];
    for (const candidate of candidates) {
      const parts = candidate?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          return {
            image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
            mimeType: part.inlineData.mimeType,
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Parse response error:', error);
    return null;
  }
}

// 模型配置
type ModelKey = 'model1' | 'model2';

interface ModelConfig {
  apiUrl: string;
  apiKey: string;
  model: string;
}

const MODEL_CONFIGS: Record<ModelKey, ModelConfig> = {
  model1: {
    apiUrl: process.env.YUNWU_API_URL || 'https://yunwu.ai',
    apiKey: process.env.YUNWU_API_KEY || '',
    model: process.env.YUNWU_MODEL || 'gemini-3.1-flash-image-preview',
  },
  model2: {
    apiUrl: process.env.VECTORENGINE_API_URL || 'https://api.vectorengine.ai',
    apiKey: process.env.VECTORENGINE_API_KEY || '',
    model: process.env.VECTORENGINE_MODEL || 'gemini-3.1-flash-image-preview',
  },
};

// 请求体类型
interface GenerateRequest {
  selectedModel?: ModelKey;
  imageType: 'product' | 'avatar' | 'banner' | 'poster';
  platform: 'meituan' | 'taobao';
  originalImage: string;
  referenceImage?: string;
  description: string;
}

// 响应体类型
interface GenerateResponse {
  success: boolean;
  data?: {
    image: string;
    mimeType: string;
  };
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<GenerateResponse>> {
  try {
    const body: GenerateRequest = await request.json();
    const { originalImage, referenceImage, description } = body;
    const modelKey: ModelKey = body.selectedModel === 'model2' ? 'model2' : 'model1';
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

    // 构建请求parts
    const parts: Array<{ inlineData?: { mimeType: string; data: string }; text?: string }> = [];

    // 添加原图
    const originalBase64 = originalImage.replace(/^data:image\/\w+;base64,/, '');
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: originalBase64,
      },
    });

    // 添加参考图（如果有）
    if (referenceImage) {
      const refBase64 = referenceImage.replace(/^data:image\/\w+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: refBase64,
        },
      });
    }

    // 添加描述文本
    const promptText = description || '请根据图片进行优化处理';
    parts.push({ text: promptText });

    // 构建API请求体
    const apiRequestBody = {
      contents: [
        {
          role: 'user',
          parts,
        },
      ],
    };

    // 调用云雾API
    const endpoint = `${modelConfig.apiUrl}/v1beta/models/${modelConfig.model}:streamGenerateContent?key=${modelConfig.apiKey}`;

    const apiResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiRequestBody),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('API Error:', errorText);
      return NextResponse.json(
        { success: false, error: `API请求失败: ${apiResponse.status}` },
        { status: 500 }
      );
    }

    // 解析响应
    const responseText = await apiResponse.text();
    const responseData = parseStreamResponse(responseText);

    if (!responseData) {
      return NextResponse.json(
        { success: false, error: '无法解析API响应' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: responseData,
    });

  } catch (error) {
    console.error('Generate API Error:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

