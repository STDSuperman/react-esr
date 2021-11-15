import ReactDOMServer from 'react-dom/server'
import { StaticRouter, Route } from 'react-router-dom'
import { routes } from './router'
import { matchRoutes } from 'react-router-config'

/**
 * 阻塞式渲染
 * @param url
 * @returns
 */
export async function blockRender(url: string) {
  const { pathname } = new URL(url);
  const branch = matchRoutes(routes, pathname);
  const route = branch[0]?.route;
  const MatchedComponent = route?.component as any;
  const initialData = MatchedComponent?.getInitialProps
    ? await MatchedComponent?.getInitialProps(route)
    : {}
  const renderContent = ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <MatchedComponent data={initialData}/>
    </StaticRouter>
  )
  // @ts-ignore: 编译时替换
  const template = __HTML_CONTENT__
  return template
    .replace(
      '<!-- ssr-out-let -->',
      `<div id="root" data-server-rendered="true">${renderContent}</div>`
    )
    .replace(
      '<!-- ssr-initial-data -->',
      `<script>window.__INITIAL_STATE__=${JSON.stringify(initialData)}</script>`
    )
}

/**
 * 渲染React组件
 * @param url
 * @returns
 */
const SSRRender = async (url: string) => {
  const { pathname } = new URL(url);
  const branch = matchRoutes(routes, pathname);
  const route = branch[0]?.route;
  const MatchedComponent = route?.component as any;
  const initialData = MatchedComponent?.getInitialProps
    ? await MatchedComponent?.getInitialProps(route)
    : {}
  const renderContent = ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <MatchedComponent data={initialData}/>
    </StaticRouter>
  )

  // @ts-ignore
  const template = __HTML_CONTENT__;
  return template
    .replace(
      '<!-- ssr-out-let -->',
      `${getRemoveSkeletonScript()}<div id="root" data-server-rendered="true">${renderContent}</div>`
    )
    .replace(
      '<!-- ssr-initial-data -->',
      `<script>window.__INITIAL_STATE__=${JSON.stringify(initialData)}</script>`
    )
}

/**
 * 将字符串写入流
 * @param writer
 * @param content
 */
const writeContentToStream = (
  writer: WritableStreamDefaultWriter,
  content: string
) => {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(content)
  writer.write(encodedData)
}

/**
 * 写入骨架屏
 * @param writer
 */
const writeSkeletonHtml = (
  writer: WritableStreamDefaultWriter
) => {
  // @ts-ignore: 编译时替换
  const skeletonHtmlContent = __SKELETON_HTML__;
  writeContentToStream(writer, skeletonHtmlContent);
}

/**
 * 流式渲染
 * @param url
 * @returns
 */
export const render = async (url: string) => {
  // 创建一个流
  const { writable, readable } = new TransformStream();
  const writer = writable.getWriter();

  // 写入骨架
  writeSkeletonHtml(writer);
  // 写入动态渲染后的数据
  writeContentToStream(writer, await SSRRender(url));
  writer.close();
  return readable;
}

const getRemoveSkeletonScript = () => {
  return `
    <script>
      window.addEventListener('load', () => {
        window.SKELETON && SKELETON.destroy();
      })
    </script>
  `
}