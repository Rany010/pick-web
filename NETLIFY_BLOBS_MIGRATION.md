# Netlify Blobs 图片存储迁移指南

本项目已从 base64 图片存储迁移到 Netlify Blobs，以提供更好的性能和存储效率。

## 🔄 迁移概述

### 之前的问题
- 使用 base64 编码存储图片，导致数据库体积庞大
- 图片数据直接存储在数据库中，影响查询性能
- 控制台输出包含大量 base64 数据，难以调试

### 现在的解决方案
- 使用 Netlify Blobs 存储图片文件
- 数据库只存储图片的访问 URL
- 通过专用的 API 端点提供图片服务
- 支持缓存和优化的图片传输

## 📁 相关文件

### 核心文件
- `netlify/functions/upload-image.js` - 图片上传 API
- `netlify/functions/get-image.js` - 图片获取 API
- `scripts/migrate-images-to-blobs.js` - 迁移脚本

### 前端组件
- `src/views/admin/BannerManage.vue` - Banner 管理
- `src/components/admin/ProductForm.vue` - 产品表单
- `src/api/admin.js` - 管理员 API 调用

## 🚀 使用方法

### 1. 图片上传流程

```javascript
// 前端上传图片
const response = await uploadImage({
  image: base64Data,        // base64 格式的图片数据
  fileName: 'image.jpg',    // 原始文件名
  mimeType: 'image/jpeg'    // MIME 类型
})

// 返回结果
{
  success: true,
  data: {
    imageUrl: 'https://your-site.netlify.app/.netlify/functions/get-image?key=xxx',
    blobKey: 'unique-filename.jpg',
    storage: 'netlify-blobs'
  }
}
```

### 2. 图片访问

图片通过以下 URL 格式访问：
```
https://your-site.netlify.app/.netlify/functions/get-image?key=filename.jpg
```

### 3. 迁移现有数据

如果你有现有的 base64 图片数据需要迁移：

```bash
# 运行迁移脚本
npm run migrate:images
```

## 🔧 配置要求

### Netlify 环境变量
确保在 Netlify 部署环境中设置了以下变量：
- `DATABASE_URL` - PostgreSQL 数据库连接字符串
- `JWT_SECRET` - JWT 密钥

### 本地开发
使用 `netlify dev` 命令启动本地开发服务器，这样可以正确模拟 Netlify Functions 环境。

## 📊 存储结构

### Netlify Blobs Store
- **Store Name**: `product-images`
- **文件命名**: `{timestamp}-{random}.{extension}`
- **Metadata**: 包含原始文件名、内容类型、上传时间等信息

### 数据库字段
- `imageUrl`: 存储访问 URL（不再是 base64 数据）
- `thumbnailUrl`: 缩略图 URL（目前与原图相同）

## 🛠️ 故障排除

### 1. 图片无法显示
- 检查 Netlify Functions 是否正常运行
- 确认图片 key 是否存在于 Blobs 存储中
- 查看浏览器网络面板的错误信息

### 2. 上传失败
- 确认文件大小不超过限制（5MB）
- 检查文件格式是否为支持的图片类型
- 查看 Netlify Functions 日志

### 3. 本地开发问题
- 使用 `netlify dev` 而不是 `npm run dev`
- 确保已安装 `@netlify/blobs` 依赖
- 检查 Netlify CLI 是否已登录

## 📈 性能优化

### 缓存策略
- 图片设置了长期缓存（1年）
- 使用 `immutable` 缓存指令
- 通过文件名版本控制实现缓存更新

### 未来改进
- [ ] 添加图片压缩和优化
- [ ] 实现多尺寸缩略图生成
- [ ] 添加图片格式转换（WebP 支持）
- [ ] 实现图片懒加载

## 🔍 监控和日志

### 上传日志
```
📸 上传图片 - 文件名: image.jpg
✅ Netlify Blobs 上传成功: 1234567890-abc123.jpg
```

### 获取日志
```
📷 获取图片: filename.jpg, 类型: image/jpeg, 大小: 12345 bytes
```

## 📝 API 文档

### POST /api/upload-image
上传图片到 Netlify Blobs

**请求体**:
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQ...",
  "fileName": "image.jpg",
  "mimeType": "image/jpeg"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "imageUrl": "https://site.netlify.app/.netlify/functions/get-image?key=xxx",
    "blobKey": "filename.jpg",
    "storage": "netlify-blobs"
  }
}
```

### GET /.netlify/functions/get-image?key=xxx
获取存储在 Netlify Blobs 中的图片

**参数**:
- `key`: 图片的唯一标识符

**响应**: 图片文件（二进制数据）

---

## 📞 支持

如果遇到问题，请检查：
1. Netlify Functions 日志
2. 浏览器开发者工具
3. 数据库连接状态

更多信息请参考 [Netlify Blobs 官方文档](https://docs.netlify.com/blobs/overview/)。
