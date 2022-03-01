### 简介
基于 Cloudflare 平台实现简易的 React-ESR 能力。

### 目录介绍

```shell
├─global.config.ts  // 全局配置
├─index.html  // vite 启动时模板 html
├─LICENSE
├─package.json
├─README.md
├─skeleton.config.json // 生成骨架屏配置，可忽略
├─tsconfig.json
├─vite.config.ts // vite 配置
├─worker.ts  // Cloudflare Worker
├─wrangler.toml  // Cloudflare 配置文件
├─yarn.lock
├─src
|  ├─App.css
|  ├─App.tsx
|  ├─entry.client.tsx  // 客户端渲染入口文件
|  ├─entry.server.tsx  // Server 端入口文件
|  ├─favicon.svg
|  ├─index.css
|  ├─index.d.ts
|  ├─vite-env.d.ts
|  ├─utils
|  |   └index.ts
|  ├─router
|  |   └index.ts
|  ├─pages
|  |   ├─about
|  |   |   └index.tsx
|  ├─components
|  |     ├─demo
|  |     |  ├─index.css
|  |     |  ├─index.tsx
|  |     |  └logo.svg
├─skeleton-output  // 骨架屏数据
|        ├─base64-ESR.txt
|        ├─skeleton-ESR.html
|        └skeleton-ESR.png
├─public
|   ├─skeleton.html
|   └template.html // ESR 渲染模板
├─build-core
|     ├─config.ts // 构建时配置
|     ├─helper.ts // 构建时工具方法
|     └index.ts // 构建脚本
```

### 安装

```shell
npm i
# or yarn
# or pnpm i
```
### 起步

这里我们如果想要开始调试的话需要改一下 wrangler.toml 文件。

- account_id：上 [clouldflare](https://dash.cloudflare.com/) 新建一个站点，然后点进站点就可以看到你的账户id了

配置好 account_id 之后，我们还需要执行一下登录命令，也就是用 Cloudflare 脚手架进行登录和配置。

- 在项目目录下执行`npm run login`
- 在项目下执行`npm run config`

然后根据提示进行操作即可。

相关 Cloudflare 文档：[wrangler cli](https://developers.cloudflare.com/workers/cli-wrangler/commands)

### 调试

在调试之前请确保你已经执行完起步阶段的操作
```shell
npm run dev
```

### 发布
```shell
npm run publish
```