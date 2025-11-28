# Netlify Blobs 配置指南

## 🔧 配置要求

### 1. 确保 Netlify Blobs 已启用

Netlify Blobs 在 Netlify 平台上默认可用，但需要确保：

1. **在 Netlify 控制台启用 Blobs**
   - 登录 Netlify 控制台
   - 进入你的站点设置
   - 确保 Blobs 功能已启用（通常默认启用）

2. **检查环境变量**
   - 不需要额外的环境变量
   - Netlify 会自动提供 `context` 信息

### 2. 本地开发配置

#### 使用 `netlify dev` 命令

**重要**：必须使用 `netlify dev` 而不是 `npm run dev`，这样才能正确模拟 Netlify Functions 环境。

```bash
# 安装 Netlify CLI（如果还没有）
npm install -g netlify-cli

# 登录 Netlify
netlify login

# 链接到你的站点（如果还没有）
netlify link

# 启动本地开发服务器
netlify dev
```

#### 为什么需要 `netlify dev`？

- `netlify dev` 会提供正确的 `context` 对象
- `context` 包含 `site.id` 和 `account.token`，这些是 Netlify Blobs 正常工作所必需的
- 直接使用 `npm run dev` 时，`context` 可能为空，导致 Blobs 无法工作

### 3. 生产环境

在生产环境中（Netlify 自动部署），`context` 会自动提供，无需额外配置。

## 🐛 故障排除

### 问题 1: "Netlify Blobs 上传失败"

**可能原因：**
1. 在本地开发时使用了 `npm run dev` 而不是 `netlify dev`
2. 未登录 Netlify CLI
3. 站点未正确链接

**解决方案：**
```bash
# 1. 确保已登录
netlify login

# 2. 链接到站点
netlify link

# 3. 使用 netlify dev 启动
netlify dev
```

### 问题 2: "Context 信息缺失"

**原因：** 不在 Netlify 环境中运行

**解决方案：**
- 本地开发：使用 `netlify dev`
- 生产环境：确保在 Netlify 平台上部署

### 问题 3: 图片上传成功但无法显示

**检查：**
1. `get-image` API 是否正常工作
2. Blob key 是否正确
3. 网络请求是否成功

**调试：**
- 查看 Netlify Functions 日志
- 检查浏览器控制台错误
- 验证图片 URL 格式

## 📝 代码说明

### upload-image.js

```javascript
// 正确的方式：使用 context 信息
const store = getStore({
  name: 'product-images',
  siteID: context?.site?.id,
  token: context?.account?.token
})
```

### get-image.js

```javascript
// 同样使用 context 信息
const store = getStore({
  name: 'product-images',
  siteID: context?.site?.id,
  token: context?.account?.token
})
```

## ✅ 验证配置

### 1. 检查 Netlify CLI

```bash
netlify --version
netlify status
```

### 2. 检查站点链接

```bash
netlify link
```

### 3. 测试上传

1. 启动 `netlify dev`
2. 尝试上传图片
3. 查看控制台日志，应该看到：
   ```
   ✅ [upload-image] Netlify Blobs store 初始化成功
   ✅ [upload-image] Netlify Blobs 上传成功: xxx.jpg
   ```

## 🔗 相关资源

- [Netlify Blobs 文档](https://docs.netlify.com/blobs/overview/)
- [Netlify CLI 文档](https://cli.netlify.com/)
- [Netlify Functions 文档](https://docs.netlify.com/functions/overview/)

