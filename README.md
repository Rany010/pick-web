# Pick-Web - Pickleball E-commerce Platform

匹克球电商平台 - 基于 Vue 3 + Netlify + PostgreSQL 构建

## 📋 项目概述

这是一个面向欧美用户的匹克球（Pickleball）产品电商平台，提供商品浏览、在线咨询等功能。

## 🛠️ 技术栈

- **前端**: Vue 3 + Vite + TailwindCSS + Pinia
- **后端**: Netlify Serverless Functions (Node.js)
- **数据库**: PostgreSQL (Netlify DB Neon)
- **ORM**: Prisma
- **部署**: Netlify

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env` 文件（参考 `.env.example`）：

```bash
# 数据库连接 - 使用 Netlify DB Neon 提供的连接字符串
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"
```

### 3. 配置数据库

#### 3.1 生成 Prisma Client

```bash
npm run db:generate
```

#### 3.2 推送数据库 Schema

```bash
npm run db:push
```

#### 3.3 填充测试数据

```bash
npm run db:seed
```

### 4. 启动开发服务器

```bash
npm run dev
```

前端将运行在 `http://localhost:5173`

### 5. 启动 Netlify Functions 本地调试（可选）

在另一个终端运行：

```bash
npx netlify dev
```

这会同时启动前端和后端服务。

## 📁 项目结构

```
pick-web/
├── src/                      # 前端源码
│   ├── api/                  # API 请求封装
│   ├── components/           # 组件
│   ├── views/                # 页面视图
│   ├── router/               # 路由配置
│   ├── stores/               # Pinia 状态管理
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── netlify/
│   └── functions/            # Serverless Functions
│       ├── utils/            # 工具函数
│       └── test-products.js  # 测试商品 API
├── prisma/
│   ├── schema.prisma         # 数据库 Schema
│   └── seed.js               # 测试数据
├── design/                   # 设计文档
├── index.html
├── vite.config.js
├── tailwind.config.js
├── netlify.toml
└── package.json
```

## 🧪 测试页面

访问 `http://localhost:5173/` 查看测试页面，点击"获取商品数据"按钮测试前后端连接。

## 📊 数据库管理

### 查看数据库

```bash
npm run db:studio
```

这会打开 Prisma Studio，可以可视化查看和编辑数据库数据。

### 重置数据库

```bash
npm run db:push -- --force-reset
npm run db:seed
```

## 🌐 部署到 Netlify

### 1. 连接 Git 仓库

将代码推送到 GitHub/GitLab/Bitbucket

### 2. 在 Netlify 创建新站点

- 选择你的代码仓库
- 构建命令: `npm run build`
- 发布目录: `dist`
- Functions 目录: `netlify/functions`

### 3. 配置环境变量

在 Netlify 设置中添加：
- `DATABASE_URL`: 你的 PostgreSQL 连接字符串

### 4. 部署

Netlify 会自动构建和部署。

## 📖 开发阶段

当前进度：**第一阶段 - 系统搭建** ✅

- [x] 项目初始化和环境配置
- [x] 数据库设计和 Prisma 配置
- [x] 前端基础架构搭建
- [x] 后端 API 基础框架搭建
- [ ] 前后端联调测试

## 🔗 相关链接

- [Vue 3 文档](https://vuejs.org/)
- [Vite 文档](https://vitejs.dev/)
- [Prisma 文档](https://www.prisma.io/docs/)
- [Netlify 文档](https://docs.netlify.com/)
- [TailwindCSS 文档](https://tailwindcss.com/)

## 📝 License

MIT

