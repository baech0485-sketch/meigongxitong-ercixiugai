import type {
  GenerateProvider,
  ParsedImageData,
} from '@/lib/generate-contracts';

export async function parseModelResponse(
  provider: GenerateProvider,
  responseText: string,
  fetchImpl: typeof fetch = fetch
): Promise<ParsedImageData | null> {
  if (provider === 'openai-chat') {
    return parseOpenAiChatResponse(responseText, fetchImpl);
  }

  return parseGeminiStreamResponse(responseText);
}

async function parseOpenAiChatResponse(
  responseText: string,
  fetchImpl: typeof fetch
): Promise<ParsedImageData | null> {
  const json = JSON.parse(responseText);
  const choices = Array.isArray(json?.choices) ? json.choices : [];

  for (const choice of choices) {
    const imageSource = extractOpenAiImageSource(choice?.message);
    if (!imageSource) {
      continue;
    }

    return resolveImageSource(imageSource, fetchImpl);
  }

  const base64Image = json?.data?.[0]?.b64_json;
  if (typeof base64Image === 'string' && base64Image) {
    return {
      image: `data:image/png;base64,${base64Image}`,
      mimeType: 'image/png',
    };
  }

  return null;
}

function parseGeminiStreamResponse(responseText: string): ParsedImageData | null {
  const lines = responseText.split('\n').filter((line) => line.trim());

  for (const line of [...lines, responseText]) {
    try {
      const json = JSON.parse(line);
      const candidates = json?.candidates || [];

      for (const candidate of candidates) {
        const parts = candidate?.content?.parts || [];
        for (const part of parts) {
          if (part?.inlineData?.mimeType && part?.inlineData?.data) {
            return {
              image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
              mimeType: part.inlineData.mimeType,
            };
          }
        }
      }
    } catch {
      continue;
    }
  }

  return null;
}

function extractOpenAiImageSource(message: unknown): string | null {
  if (!message || typeof message !== 'object') {
    return null;
  }

  const directImageUrl = readImageUrl((message as { image_url?: unknown }).image_url);
  if (directImageUrl) {
    return directImageUrl;
  }

  const content = (message as { content?: unknown }).content;
  if (Array.isArray(content)) {
    for (const item of content) {
      if (item && typeof item === 'object' && (item as { type?: string }).type === 'image_url') {
        const nestedImageUrl = readImageUrl((item as { image_url?: unknown }).image_url);
        if (nestedImageUrl) {
          return nestedImageUrl;
        }
      }
    }
  }

  if (typeof content === 'string') {
    const markdownMatch = content.match(/!\[[^\]]*]\(([^)]+)\)/);
    if (markdownMatch?.[1]) {
      return markdownMatch[1];
    }

    const urlMatch = content.match(/data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+|https?:\/\/\S+/);
    if (urlMatch?.[0]) {
      return urlMatch[0];
    }
  }

  return null;
}

function readImageUrl(imageUrl: unknown): string | null {
  if (typeof imageUrl === 'string') {
    return imageUrl;
  }

  if (imageUrl && typeof imageUrl === 'object' && typeof (imageUrl as { url?: unknown }).url === 'string') {
    return (imageUrl as { url: string }).url;
  }

  return null;
}

async function resolveImageSource(
  imageSource: string,
  fetchImpl: typeof fetch
): Promise<ParsedImageData | null> {
  const parsedDataUrl = parseDataUrl(imageSource);
  if (parsedDataUrl) {
    return {
      image: imageSource,
      mimeType: parsedDataUrl.mimeType,
    };
  }

  if (!/^https?:\/\//.test(imageSource)) {
    return null;
  }

  const response = await fetchImpl(imageSource);
  if (!response.ok) {
    return null;
  }

  const mimeType = response.headers.get('content-type')?.split(';')[0] || 'image/png';
  const buffer = Buffer.from(await response.arrayBuffer());

  return {
    image: `data:${mimeType};base64,${buffer.toString('base64')}`,
    mimeType,
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
