/**
 * 下载助手 - 兼容 Web 和 Tauri 环境
 */

/**
 * 检测是否在 Tauri 环境中运行
 */
export function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI__' in window;
}

/**
 * 将 Blob 转换为 ArrayBuffer
 */
async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}

/**
 * Web 环境下载
 */
function downloadInWeb(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Tauri 环境下载 - 使用全局 __TAURI__ 对象
 */
async function downloadInTauri(blob: Blob, filename: string): Promise<boolean> {
  try {
    // 通过全局对象访问 Tauri API，避免编译时警告
    const tauriWindow = window as Window & {
      __TAURI__?: {
        dialog?: { save: (options: unknown) => Promise<string | null> };
        fs?: { writeFile: (path: string, data: Uint8Array) => Promise<void> };
      };
    };

    const tauri = tauriWindow.__TAURI__;
    if (!tauri?.dialog?.save || !tauri?.fs?.writeFile) {
      // Tauri API 不可用，回退到 Web 方式
      downloadInWeb(blob, filename);
      return true;
    }

    // 打开保存对话框
    const filePath = await tauri.dialog.save({
      defaultPath: filename,
      filters: [{ name: 'Image', extensions: ['jpg', 'jpeg', 'png'] }],
    });

    if (!filePath) {
      return false; // 用户取消
    }

    // 将 Blob 转换为 Uint8Array
    const arrayBuffer = await blobToArrayBuffer(blob);
    const uint8Array = new Uint8Array(arrayBuffer);

    // 写入文件
    await tauri.fs.writeFile(filePath, uint8Array);
    return true;
  } catch (error) {
    console.error('Tauri 下载失败，回退到 Web 方式:', error);
    downloadInWeb(blob, filename);
    return true;
  }
}

/**
 * 通用下载函数 - 自动检测环境
 */
export async function downloadFile(
  blob: Blob,
  filename: string
): Promise<boolean> {
  if (isTauri()) {
    return downloadInTauri(blob, filename);
  } else {
    downloadInWeb(blob, filename);
    return true;
  }
}

/**
 * 从 Canvas 下载图片 - 兼容 Web 和 Tauri
 */
export async function downloadCanvasAsImage(
  canvas: HTMLCanvasElement,
  filename: string,
  mimeType: string = 'image/jpeg',
  quality: number = 0.92
): Promise<boolean> {
  return new Promise((resolve) => {
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          resolve(false);
          return;
        }
        const result = await downloadFile(blob, filename);
        resolve(result);
      },
      mimeType,
      quality
    );
  });
}
