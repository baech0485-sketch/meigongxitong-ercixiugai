import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildOssObjectKey,
  buildOssPublicUrl,
  resolveGeneratedImageUpload,
} from './oss-storage.ts';

test('从 data URL 解析生成图片上传数据', async () => {
  const result = await resolveGeneratedImageUpload({
    image: 'data:image/png;base64,QUJDRA==',
    mimeType: 'image/png',
    fallbackFilename: 'result',
  });

  assert.equal(result.mimeType, 'image/png');
  assert.equal(result.extension, '.png');
  assert.equal(result.buffer.toString('utf8'), 'ABCD');
});

test('从远程 URL 下载生成图片后再上传', async () => {
  const result = await resolveGeneratedImageUpload({
    image: 'https://example.com/output',
    mimeType: 'image/jpeg',
    fallbackFilename: 'output.jpg',
    fetchImpl: async () =>
      new Response(Uint8Array.from([1, 2, 3]), {
        status: 200,
        headers: {
          'content-type': 'image/jpeg',
        },
      }),
  });

  assert.equal(result.mimeType, 'image/jpeg');
  assert.equal(result.extension, '.jpg');
  assert.deepEqual([...result.buffer], [1, 2, 3]);
});

test('按日期和扩展名生成 OSS 对象路径', () => {
  const path = buildOssObjectKey({
    folder: 'generated-results',
    extension: '.jpg',
    date: new Date('2026-04-16T08:00:00.000Z'),
    id: 'fixed-id',
  });

  assert.equal(path, 'generated-results/2026-04-16/fixed-id.jpg');
});

test('优先使用自定义域名生成 OSS 公开地址', () => {
  const url = buildOssPublicUrl(
    {
      bucket: 'demo-bucket',
      region: 'oss-cn-hangzhou',
      customDomain: 'https://cdn.example.com',
    },
    'generated-results/2026-04-16/fixed-id.jpg'
  );

  assert.equal(url, 'https://cdn.example.com/generated-results/2026-04-16/fixed-id.jpg');
});

test('未配置自定义域名时使用默认 OSS 域名', () => {
  const url = buildOssPublicUrl(
    {
      bucket: 'demo-bucket',
      region: 'oss-cn-hangzhou',
    },
    'generated-results/2026-04-16/fixed-id.jpg'
  );

  assert.equal(
    url,
    'https://demo-bucket.oss-cn-hangzhou.aliyuncs.com/generated-results/2026-04-16/fixed-id.jpg'
  );
});
