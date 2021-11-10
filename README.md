### 简介
基于Cloudflare平台实现简易的React-ESR能力。

### 目录介绍

```shell
├── LICENSE
├── README.md
├── build-core  // 构建相关
│   ├── config.ts // 常量配置
│   ├── helper.ts // 工具方法
│   └── index.ts // 主逻辑
├── index.html // 模板文件
├── package.json
├── pnpm-lock.yaml
├── src // react项目代码
│   ├── App.css
│   ├── App.tsx
│   ├── entry.client.tsx // 客户端入口文件
│   ├── entry.server.tsx // server端入口文件
│   ├── favicon.svg
│   ├── index.css
│   ├── index.d.ts
│   ├── logo.svg
│   ├── pages
│   │   └── about
│   │       └── index.tsx
│   ├── router // 路由
│   │   └── index.ts
│   ├── utils
│   │   └── index.ts
│   └── vite-env.d.ts
├── tsconfig.json
├── vite.config.ts
├── worker.ts // 边缘节点执行逻辑
└── wrangler.toml // cloudflare配置文件
```

### 安装

```shell
npm i
# or yarn
# or pnpm i
```

### 起步

这里我们如果想要开始调试的话需要改一下wrangler.toml文件。

- account_id：上[clouldflare](https://dash.cloudflare.com/)新建一个站点，然后点进站点就可以看到你的账户id了

配置好account_id之后，我们还需要执行一下登录命令，也就是用cloudflare脚手架进行登录和配置。

- 在项目目录下执行`npm run login`
- 在项目下执行`npm run config`

然后根据提示进行操作即可。

相关cloudflare文档：[wrangler cli](https://developers.cloudflare.com/workers/cli-wrangler/commands)

### 调试

在调试之前请确保你已经执行完起步阶段的操作
```shell
npm run dev
```

### 发布
```shell
npm run publish
```