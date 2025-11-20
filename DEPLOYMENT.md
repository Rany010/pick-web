# 🚀 Netlify 部署指南

## 📋 部署前准备

### 1. 准备数据库

#### 创建 Neon PostgreSQL 数据库

1. 访问 [Neon](https://neon.tech/)
2. 注册并登录
3. 点击 "Create a project"
4. 填写项目信息：
   - Project name: `pick-web`
   - Region: 选择离目标用户最近的区域（美国用户选 US East）
5. 创建后，复制连接字符串（类似这样）：
   ```
   postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### 2. 准备代码仓库

#### 推送代码到 GitHub

```bash
# 在项目根目录
git init
git add .
git commit -m "feat: 第一阶段完成 - 系统搭建"

# 创建 GitHub 仓库后
git remote add origin https://github.com/你的用户名/pick-web.git
git branch -M main
git push -u origin main
```

## 🌐 部署到 Netlify

### 步骤 1: 连接 GitHub 仓库

1. 登录 [Netlify](https://www.netlify.com/)
2. 点击 "Add new site" → "Import an existing project"
3. 选择 "GitHub"
4. 授权 Netlify 访问你的 GitHub
5. 选择 `pick-web` 仓库

### 步骤 2: 配置构建设置

Netlify 会自动检测到 `netlify.toml` 配置文件，确认以下设置：

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Functions directory**: `netlify/functions`

### 步骤 3: 配置环境变量

在 "Site settings" → "Environment variables" 中添加：

| Key | Value | 说明 |
|-----|-------|------|
| `DATABASE_URL` | `postgresql://...` | Neon 数据库连接字符串 |
| `JWT_SECRET` | `your-random-secret` | JWT 密钥（随机字符串） |
| `NODE_ENV` | `production` | 生产环境标识 |

### 步骤 4: 触发部署

1. 点击 "Deploy site"
2. 等待构建完成（通常 2-3 分钟）
3. 构建成功后，你会看到一个类似 `https://你的项目名.netlify.app` 的 URL

### 步骤 5: 初始化数据库

部署成功后，需要初始化数据库：

#### 方式一：使用 Netlify CLI（推荐）

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 连接到你的站点
netlify link

# 设置环境变量（如果还没设置）
netlify env:set DATABASE_URL "postgresql://..."

# 在 Netlify 环境中执行数据库初始化
netlify functions:invoke --name=db-init
```

#### 方式二：本地连接生产数据库

```bash
# 创建 .env.production
DATABASE_URL="你的Neon数据库连接"

# 使用生产环境的 URL 初始化
npm run db:push
npm run db:seed
```

### 步骤 6: 测试部署

1. 访问你的 Netlify URL
2. 应该看到测试页面
3. 点击"获取商品数据"按钮
4. 如果显示商品数据，说明部署成功！🎉

## 🔧 常见问题

### Q1: 数据库连接失败

**问题**: Functions 日志显示 "Can't reach database server"

**解决方案**:
1. 检查 Netlify 环境变量中的 `DATABASE_URL` 是否正确
2. 确认 Neon 数据库处于活动状态
3. 检查连接字符串中是否包含 `?sslmode=require`

### Q2: Functions 执行超时

**问题**: "Function invocation timeout"

**解决方案**:
1. 在 `netlify.toml` 中增加超时时间：
```toml
[functions]
  node_bundler = "esbuild"
  included_files = ["prisma/schema.prisma"]
  
[[functions."*"]]
  timeout = 10
```

2. 优化 Prisma 连接：
```javascript
// 在 db.js 中使用连接池
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})
```

### Q3: 构建失败

**问题**: "Build failed" 或 "Prisma schema not found"

**解决方案**:
1. 确保 `prisma/schema.prisma` 在代码仓库中
2. 在 `netlify.toml` 中添加：
```toml
[build.environment]
  NODE_VERSION = "18"
  PRISMA_CLI_BINARY_TARGETS = "native,rhel-openssl-1.0.x"
```

### Q4: 页面加载但 API 失败

**问题**: 前端显示但无法获取数据

**解决方案**:
1. 检查 Netlify Functions 日志：Site settings → Functions → 查看日志
2. 确认 API 路由正确：`/.netlify/functions/test-products`
3. 检查浏览器控制台的网络请求

## 🎯 部署检查清单

部署完成后，检查以下项目：

- [ ] ✅ 网站可以访问
- [ ] ✅ 测试页面正常显示
- [ ] ✅ 点击按钮可以获取数据
- [ ] ✅ 数据库连接正常
- [ ] ✅ Functions 运行正常
- [ ] ✅ 环境变量配置正确
- [ ] ✅ 没有控制台错误

## 📊 监控和维护

### 查看日志

1. **构建日志**: Deploys → 点击具体部署 → Deploy log
2. **Functions 日志**: Functions → 选择函数 → Function log
3. **实时日志**: 使用 Netlify CLI
   ```bash
   netlify logs --tail
   ```

### 性能监控

在 Netlify 中查看：
- **Analytics**: 访问量、地理位置等
- **Functions**: 执行次数、执行时间、错误率

### 数据库监控

在 Neon Dashboard 中查看：
- 连接数
- 查询性能
- 存储使用量

## 🔄 更新部署

每次推送代码到 main 分支，Netlify 会自动重新部署：

```bash
git add .
git commit -m "feat: 添加新功能"
git push origin main
```

## 🌐 自定义域名（可选）

1. 在 Netlify: Site settings → Domain management
2. 点击 "Add custom domain"
3. 输入你的域名
4. 按照提示配置 DNS 记录
5. Netlify 会自动提供免费的 SSL 证书

## 🎉 完成！

现在你的应用已经部署到 Netlify，全球用户都可以访问了！

下一步可以开始开发第二阶段的功能。

