// @ts-ignore
import { render } from '__SSR_SERVER__' // 构件时会将entry.server.ts文件构建产物path替换此字符串
import mime from 'mime'
import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'

const enum RenderMode {
  ESR = 'esr',
  CSR = 'csr'
}

const renderMode: RenderMode = RenderMode.ESR; // esr;

interface Request {
  cf: Record<string, unknown>;
  signal: Record<string, unknown>;
  fetcher: Record<string, unknown>;
  redirect: string;
  headers: Record<string, unknown>;
  url: string;
  method: string;
  bodyUsed: boolean;
  body: unknown[];
}

addEventListener('fetch', (event: any) => {
  event.respondWith(handleRequest(event))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(event: any) {
  const request: Request = event.request;
  const mimeType = getResContentType(request);
  if (!mimeType) {
    const content = renderMode === RenderMode.CSR ? await getCsrHtml() : await renderESR(request);
    return new Response(content, {
      headers: {
        "Content-Type": "text/html; charset=utf-8"
      }
    });
  } else {
    return await getAssetsResource(event);
  }
}

const renderESR = async (request: Request) => {
  return render(request.url, request)
}

const getCsrHtml = async () => {
  // @ts-ignore: 编译时替换
  return __HTML_CONTENT__.replace(
    '<!-- ssr-out-let -->',
    `<div id="root"></div>`
  );
}

const getAssetsResource = async (event: any) => {
  try {
    const cacheTime = 12 * 60 * 60;
    const response = await getAssetFromKV(event, {
      cacheControl: {
        browserTTL: cacheTime,
        edgeTTL: cacheTime
      }
    })

    if (!response.ok) {
      throw new Error('Get Error')
    }

    return await response
  } catch (error) {
    return new Response('404');
  }
}

const getResContentType = (request: Request) => {
  // @ts-ignore: 类型文件似乎有问题
  return mime.getType(request.url);
}