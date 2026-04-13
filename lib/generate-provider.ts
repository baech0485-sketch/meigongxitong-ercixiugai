import type {
  BuiltModelRequest,
  GenerateModelConfig,
  GenerateRequestPayload,
} from '@/lib/generate-contracts';

const DEFAULT_PROMPT = '请根据图片进行优化处理';

export function buildModelRequest(
  modelConfig: GenerateModelConfig,
  request: GenerateRequestPayload
): BuiltModelRequest {
  if (modelConfig.provider === 'openai-chat') {
    return buildOpenAiChatRequest(modelConfig, request);
  }

  return buildGeminiStreamRequest(modelConfig, request);
}

function buildGeminiStreamRequest(
  modelConfig: GenerateModelConfig,
  request: GenerateRequestPayload
): BuiltModelRequest {
  const parts = [
    createGeminiInlinePart(request.originalImage),
    ...(request.referenceImage ? [createGeminiInlinePart(request.referenceImage)] : []),
    { text: request.description || DEFAULT_PROMPT },
  ];

  return {
    url: `${modelConfig.apiUrl}/v1beta/models/${modelConfig.model}:streamGenerateContent?key=${modelConfig.apiKey}`,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts,
        },
      ],
    }),
  };
}

function buildOpenAiChatRequest(
  modelConfig: GenerateModelConfig,
  request: GenerateRequestPayload
): BuiltModelRequest {
  const content = [
    { type: 'text', text: request.description || DEFAULT_PROMPT },
    createOpenAiImagePart(request.originalImage),
    ...(request.referenceImage ? [createOpenAiImagePart(request.referenceImage)] : []),
  ];

  return {
    url: modelConfig.apiUrl,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${modelConfig.apiKey}`,
    },
    body: JSON.stringify({
      model: modelConfig.model,
      messages: [
        {
          role: 'user',
          content,
        },
      ],
    }),
  };
}

function createGeminiInlinePart(imageDataUrl: string) {
  const parsedDataUrl = parseDataUrl(imageDataUrl);

  return {
    inlineData: {
      mimeType: parsedDataUrl?.mimeType || 'image/jpeg',
      data: parsedDataUrl?.data || imageDataUrl,
    },
  };
}

function createOpenAiImagePart(imageDataUrl: string) {
  return {
    type: 'image_url',
    image_url: {
      url: imageDataUrl,
    },
  };
}

function parseDataUrl(value: string): { mimeType: string; data: string } | null {
  const dataPrefix = ';base64,';
  if (!value.startsWith('data:')) {
    return null;
  }

  const separatorIndex = value.indexOf(dataPrefix);
  if (separatorIndex === -1) {
    return null;
  }

  return {
    mimeType: value.slice(5, separatorIndex),
    data: value.slice(separatorIndex + dataPrefix.length),
  };
}
