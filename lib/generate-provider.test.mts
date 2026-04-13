import assert from 'node:assert/strict';
import test from 'node:test';

import { buildModelRequest } from './generate-provider.ts';
import { parseModelResponse } from './generate-parser.ts';

const sampleRequest = {
  imageType: 'banner',
  platform: 'meituan',
  originalImage: 'data:image/jpeg;base64,ORIGINAL_BASE64',
  referenceImage: 'data:image/png;base64,REFERENCE_BASE64',
  description: '请保留主体并优化画面质感',
  selectedModel: 'model3',
} as const;

test('为 pockgo 构建 OpenAI 兼容请求体', () => {
  const modelConfig = {
    provider: 'openai-chat',
    apiUrl: 'https://newapi.aicohere.org/v1/chat/completions',
    apiKey: 'test-key',
    model: 'gemini-3.1-flash-image-preview',
  } as const;

  const builtRequest = buildModelRequest(modelConfig, sampleRequest);
  const requestBody = JSON.parse(builtRequest.body);

  assert.equal(builtRequest.url, 'https://newapi.aicohere.org/v1/chat/completions');
  assert.equal(builtRequest.headers.Authorization, 'Bearer test-key');
  assert.equal(requestBody.model, 'gemini-3.1-flash-image-preview');
  assert.equal(requestBody.messages[0].content[0].type, 'text');
  assert.equal(requestBody.messages[0].content[1].type, 'image_url');
  assert.equal(
    requestBody.messages[0].content[1].image_url.url,
    'data:image/jpeg;base64,ORIGINAL_BASE64'
  );
  assert.equal(
    requestBody.messages[0].content[2].image_url.url,
    'data:image/png;base64,REFERENCE_BASE64'
  );
});

test('解析 pockgo 返回的 image_url 对象', async () => {
  const responseText = JSON.stringify({
    choices: [
      {
        message: {
          image_url: {
            url: 'data:image/png;base64,RESULT_IMAGE_BASE64',
          },
        },
      },
    ],
  });

  const parsedResponse = await parseModelResponse('openai-chat', responseText);

  assert.deepEqual(parsedResponse, {
    image: 'data:image/png;base64,RESULT_IMAGE_BASE64',
    mimeType: 'image/png',
  });
});

test('解析 pockgo 返回的 content 数组图片', async () => {
  const responseText = JSON.stringify({
    choices: [
      {
        message: {
          content: [
            { type: 'text', text: '处理完成' },
            {
              type: 'image_url',
              image_url: {
                url: 'data:image/jpeg;base64,ARRAY_RESULT_BASE64',
              },
            },
          ],
        },
      },
    ],
  });

  const parsedResponse = await parseModelResponse('openai-chat', responseText);

  assert.deepEqual(parsedResponse, {
    image: 'data:image/jpeg;base64,ARRAY_RESULT_BASE64',
    mimeType: 'image/jpeg',
  });
});

test('继续兼容 Gemini 流式图片响应解析', async () => {
  const responseText = JSON.stringify({
    candidates: [
      {
        content: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: 'STREAM_RESULT_BASE64',
              },
            },
          ],
        },
      },
    ],
  });

  const parsedResponse = await parseModelResponse('gemini-stream', responseText);

  assert.deepEqual(parsedResponse, {
    image: 'data:image/jpeg;base64,STREAM_RESULT_BASE64',
    mimeType: 'image/jpeg',
  });
});
