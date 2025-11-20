# 🚀 第一阶段部署指南

本文档将指导你完成第一阶段的部署和测试工作。

## 📋 前置准备

### 1. 创建 Netlify 账号

1. 访问 [Netlify](https://www.netlify.com/)
2. 注册账号（可以使用 GitHub 账号直接登录）

### 2. 创建 PostgreSQL 数据库

#### 方式一：使用 Netlify DB (推荐)

1. 在 Netlify Dashboard，点击 "Integrations"
2. 搜索 "Neon" 或 "PostgreSQL"
3. 连接 Neon 数据库服务
4. 创建新的数据库实例
5. 复制数据库连接字符串（DATABASE_URL）

#### 方式二：使用 Neon 直接创建

1. 访问 [Neon](https://neon.tech/)
2. 注册并创建新项目
3. 创建数据库
4. 复制连接字符串

## 🔧 本地开发配置

### 1. 安装依赖

```bash
cd /home/yxt/workspace_yxt/demo/pick-web
npm install
```

### 2. 配置环境变量

创建 `.env` 文件：

```bash
# 在项目根目录创建 .env 文件
cat > .env << 'EOF'
# 数据库连接（替换为你的实际连接字符串）
DATABASE_URL="postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# JWT 密钥（可以随机生成）
JWT_SECRET="your-random-secret-key-here"

# Node 环境
NODE_ENV="development"
EOF
```

### 3. 初始化数据库

```bash
# 生成 Prisma Client
npm run db:generate

# 推送数据库 Schema（创建表）
npm run db:push

# 填充测试数据
npm run db:seed
```

你应该看到类似的输出：

```
🌱 开始填充测试数据...
✅ 清除旧数据完成
✅ 创建了 5 个测试商品数据

📦 测试商品列表:
  - Carbon Fiber Pickleball Paddle ($89.99)
  - Kids Pickleball Paddle Set ($39.99)
  - Pickleball Net System ($129.99)
  - Premium Pickleball Balls (12-pack) ($24.99)
  - Pickleball Paddle Bag ($54.99)

🎉 数据填充完成！
```

### 4. 启动本地开发环境

#### 方式一：使用 Netlify Dev（推荐）

```bash
# 需要先安装 Netlify CLI
npm install -g netlify-cli

# 启动 Netlify 本地开发环境
netlify dev
```

这会同时启动：
- 前端开发服务器（Vite）
- 后端 Functions 服务器
- 自动代理和路由配置

访问提示的地址（通常是 `http://localhost:8888`）

#### 方式二：分别启动前后端

```bash
# 终端 1：启动前端
npm run dev

# 终端 2：启动 Netlify Functions
netlify functions:serve
```

访问 `http://localhost:5173`

## 🧪 测试流程

### 1. 访问测试页面

打开浏览器，访问首页（`http://localhost:8888` 或 `http://localhost:5173`）

你应该看到一个标题为 "🏓 Pick-Web Test Page" 的页面。

### 2. 测试数据库连接

1. 点击 "📦 获取商品数据" 按钮
2. 如果连接成功，你会看到：
   - 成功提示信息
   - 5 个测试商品的卡片展示
   - 系统状态显示为 "✅ 已连接"

### 3. 验证数据

确认显示的商品数据包括：
- Carbon Fiber Pickleball Paddle ($89.99)
- Kids Pickleball Paddle Set ($39.99)
- Pickleball Net System ($129.99)
- Premium Pickleball Balls 12-pack ($24.99)
- Pickleball Paddle Bag ($54.99)

### 4. 测试清除功能

点击 "🗑️ 清除数据" 按钮，页面应该清空数据展示。

## 🔍 故障排查

### 问题 1：无法连接数据库

**错误信息**: "获取商品数据失败"

**解决方案**:
1. 检查 `.env` 文件中的 `DATABASE_URL` 是否正确
2. 确认数据库已创建且可以访问
3. 检查网络连接
4. 查看终端中的错误日志

```bash
# 测试数据库连接
npm run db:studio
```

### 问题 2：API 404 错误

**错误信息**: "404 Not Found"

**解决方案**:
1. 确认使用 `netlify dev` 启动项目
2. 或者确保 Netlify Functions 服务器正在运行
3. 检查 `netlify.toml` 配置是否正确

### 问题 3：没有数据显示

**解决方案**:
1. 重新运行数据填充命令：
```bash
npm run db:seed
```

2. 使用 Prisma Studio 检查数据：
```bash
npm run db:studio
```

### 问题 4：端口被占用

**错误信息**: "Port 5173 is already in use"

**解决方案**:
```bash
# 查找占用端口的进程
lsof -i :5173

# 杀死进程（替换 PID）
kill -9 <PID>
```

## 📊 查看数据库

启动 Prisma Studio 可视化查看数据库：

```bash
npm run db:studio
```

浏览器会自动打开 `http://localhost:5555`，你可以：
- 查看所有表和数据
- 添加、编辑、删除数据
- 执行查询

## ✅ 验收标准

第一阶段完成的标准：

- [x] ✅ 项目成功启动，无错误
- [x] ✅ 数据库连接成功
- [x] ✅ 测试数据已填充
- [x] ✅ 前端页面正常显示
- [x] ✅ 点击按钮可以获取并显示数据库数据
- [x] ✅ 整个流程走通（前端 → API → 数据库 → 前端展示）

## 🎯 下一步

第一阶段完成后，可以开始：

1. **第二阶段：核心功能开发**
   - 商品管理功能（管理端）
   - 分类和标签管理
   - 商品展示功能（用户端）
   - 商品详情页
   - 图片上传和管理

## 📞 需要帮助？

如果遇到问题：
1. 检查本文档的"故障排查"章节
2. 查看终端中的错误日志
3. 查看浏览器控制台的错误信息
4. 检查 `.env` 配置是否正确

