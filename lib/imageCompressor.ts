/**
 * 图片压缩工具
 * 自动压缩上传的图片，避免Vercel请求体大小限制
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
}

const defaultOptions: CompressOptions = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.8,
  maxSizeKB: 500, // 目标最大500KB
};

/**
 * 压缩图片文件
 */
export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const opts = { ...defaultOptions, ...options };

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('无法创建canvas上下文'));
          return;
        }

        // 计算缩放后的尺寸
        let { width, height } = img;
        const maxW = opts.maxWidth!;
        const maxH = opts.maxHeight!;

        if (width > maxW || height > maxH) {
          const ratio = Math.min(maxW / width, maxH / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        // 绘制图片
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // 递归压缩直到满足大小要求
        let quality = opts.quality!;
        const compress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('压缩失败'));
                return;
              }

              const sizeKB = blob.size / 1024;

              // 如果大小满足要求或质量已经很低，返回结果
              if (sizeKB <= opts.maxSizeKB! || quality <= 0.3) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                console.log(
                  `图片压缩完成: ${(file.size / 1024).toFixed(1)}KB -> ${sizeKB.toFixed(1)}KB`
                );
                resolve(compressedFile);
              } else {
                // 继续降低质量
                quality -= 0.1;
                compress();
              }
            },
            'image/jpeg',
            quality
          );
        };

        compress();
      };

      img.onerror = () => {
        reject(new Error('图片加载失败'));
      };
    };

    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
  });
}

/**
 * 压缩图片并返回Base64
 */
export async function compressImageToBase64(
  file: File,
  options: CompressOptions = {}
): Promise<string> {
  const compressedFile = await compressImage(file, options);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(compressedFile);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Base64转换失败'));
  });
}
