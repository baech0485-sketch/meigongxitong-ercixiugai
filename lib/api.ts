// API调用封装

export interface GenerateRequest {
  imageType: 'product' | 'avatar' | 'banner' | 'poster';
  platform: 'meituan' | 'taobao';
  originalImage: string;
  referenceImage?: string;
  description: string;
}

export interface GenerateResponse {
  success: boolean;
  data?: {
    image: string;
    mimeType: string;
  };
  error?: string;
}

// 将File转换为Base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// 调用生成API
export const generateImage = async (
  request: GenerateRequest
): Promise<GenerateResponse> => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  return response.json();
};
