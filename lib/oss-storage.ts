import OSS from 'ali-oss';
import { randomUUID } from 'node:crypto';
import path from 'node:path';

const DEFAULT_FOLDER = 'generated-results';

const MIME_EXTENSION_MAP: Record<string, string> = {
  'image/gif': '.gif',
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/svg+xml': '.svg',
  'image/webp': '.webp',
};

interface OssPublicConfig {
  bucket: string;
  region: string;
  customDomain?: string;
}

interface ResolveGeneratedImageUploadParams {
  image: string;
  mimeType: string;
  fallbackFilename: string;
  fetchImpl?: typeof fetch;
}

interface BuildOssObjectKeyParams {
  folder?: string;
  extension: string;
  date?: Date;
  id?: string;
}

interface UploadGeneratedImageToOSSParams extends ResolveGeneratedImageUploadParams {
  folder?: string;
}

interface OssRuntimeConfig extends OssPublicConfig {
  accessKeyId: string;
  accessKeySecret: string;
  useAccelerate: boolean;
}

export interface UploadedGeneratedImage {
  filename: string;
  mimeType: string;
  path: string;
  url: string;
}

export function isOssConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(
    env.ALI_OSS_REGION &&
      env.ALI_OSS_ACCESS_KEY_ID &&
      env.ALI_OSS_ACCESS_KEY_SECRET &&
      env.ALI_OSS_BUCKET
  );
}

export async function resolveGeneratedImageUpload(
  params: ResolveGeneratedImageUploadParams
): Promise<{ buffer: Buffer; extension: string; mimeType: string }> {
  const { image, fallbackFilename, fetchImpl = fetch } = params;
  const parsedDataUrl = parseDataUrl(image);

  if (parsedDataUrl) {
    return {
      buffer: Buffer.from(parsedDataUrl.data, 'base64'),
      extension: pickFileExtension(parsedDataUrl.mimeType, fallbackFilename),
      mimeType: parsedDataUrl.mimeType,
    };
  }

  if (!/^https?:\/\//.test(image)) {
    throw new Error('仅支持 data URL 或 http/https 图片地址上传到 OSS');
  }

  const response = await fetchImpl(image);
  if (!response.ok) {
    throw new Error(`下载待上传图片失败: ${response.status}`);
  }

  const mimeType = response.headers.get('content-type')?.split(';')[0] || params.mimeType;

  return {
    buffer: Buffer.from(await response.arrayBuffer()),
    extension: pickFileExtension(mimeType, fallbackFilename),
    mimeType,
  };
}

export function buildOssObjectKey(params: BuildOssObjectKeyParams): string {
  const date = params.date ?? new Date();
  const folder = params.folder ?? DEFAULT_FOLDER;
  const id = params.id ?? randomUUID();
  const normalizedExtension = normalizeExtension(params.extension);

  return `${folder}/${date.toISOString().slice(0, 10)}/${id}${normalizedExtension}`;
}

export function buildOssPublicUrl(config: OssPublicConfig, objectKey: string): string {
  const customDomain = config.customDomain?.replace(/\/+$/, '');
  if (customDomain) {
    return `${customDomain}/${objectKey}`;
  }

  return `https://${config.bucket}.${config.region}.aliyuncs.com/${objectKey}`;
}

export async function uploadGeneratedImageToOSS(
  params: UploadGeneratedImageToOSSParams
): Promise<UploadedGeneratedImage> {
  const ossConfig = getOssRuntimeConfig();
  const resolvedImage = await resolveGeneratedImageUpload(params);
  const objectKey = buildOssObjectKey({
    folder: params.folder,
    extension: resolvedImage.extension,
  });

  const clientOptions: OSS.Options = {
    accessKeyId: ossConfig.accessKeyId,
    accessKeySecret: ossConfig.accessKeySecret,
    bucket: ossConfig.bucket,
    secure: true,
    timeout: 60000,
  };

  if (ossConfig.useAccelerate) {
    clientOptions.endpoint = `https://${ossConfig.bucket}.oss-accelerate.aliyuncs.com`;
    clientOptions.cname = true;
  } else {
    clientOptions.region = ossConfig.region;
  }

  const client = new OSS(clientOptions);

  await client.put(objectKey, resolvedImage.buffer, {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Disposition': 'inline',
      'Content-Type': resolvedImage.mimeType,
    },
  });

  return {
    filename: path.basename(objectKey),
    mimeType: resolvedImage.mimeType,
    path: objectKey,
    url: buildOssPublicUrl(ossConfig, objectKey),
  };
}

function getOssRuntimeConfig(env: NodeJS.ProcessEnv = process.env): OssRuntimeConfig {
  const region = env.ALI_OSS_REGION;
  const accessKeyId = env.ALI_OSS_ACCESS_KEY_ID;
  const accessKeySecret = env.ALI_OSS_ACCESS_KEY_SECRET;
  const bucket = env.ALI_OSS_BUCKET;

  if (!region || !accessKeyId || !accessKeySecret || !bucket) {
    throw new Error('阿里云 OSS 环境变量未完整配置');
  }

  const isVercel = env.VERCEL === '1' || Boolean(env.AWS_LAMBDA_FUNCTION_NAME);

  return {
    region,
    accessKeyId,
    accessKeySecret,
    bucket,
    customDomain: env.ALI_OSS_CUSTOM_DOMAIN,
    useAccelerate: isVercel || env.ALI_OSS_USE_ACCELERATE === 'true',
  };
}

function parseDataUrl(value: string): { data: string; mimeType: string } | null {
  const match = value.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    return null;
  }

  return {
    mimeType: match[1],
    data: match[2],
  };
}

function pickFileExtension(mimeType: string, fallbackFilename: string): string {
  const fallbackExtension = path.extname(fallbackFilename);
  if (fallbackExtension) {
    return normalizeExtension(fallbackExtension);
  }

  return normalizeExtension(MIME_EXTENSION_MAP[mimeType] || '.png');
}

function normalizeExtension(extension: string): string {
  const normalized = extension.startsWith('.') ? extension : `.${extension}`;
  return normalized === '.jpeg' ? '.jpg' : normalized;
}
