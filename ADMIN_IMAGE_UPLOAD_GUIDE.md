# 📸 管理员图片上传功能使用指南

## 功能概述

管理员在添加或编辑商品时，可以直接上传图片文件，而不需要提供图片URL。系统支持：

- ✅ 多图上传（最多5张）
- ✅ 实时预览
- ✅ 主图标识
- ✅ 删除图片
- ✅ 文件验证（类型、大小）
- ✅ 三种存储方案

## 🎯 使用步骤

### 1. 添加商品时上传图片

1. 登录管理后台：`/admin/login`
2. 进入商品管理：`/admin/products`
3. 点击 **"Add Product"** 按钮
4. 填写商品基本信息
5. 在 **"Product Images"** 区域：
   - 点击 **"Upload Images"** 按钮
   - 选择1-5张图片文件
   - 系统会自动上传并显示预览
6. 调整图片顺序（第一张为主图）
7. 点击 **"Create Product"** 提交

### 2. 编辑商品时管理图片

1. 在商品列表中点击 **"Edit"**
2. 在图片区域可以：
   - 添加新图片（如果未达到5张限制）
   - 删除现有图片（悬停显示删除按钮）
3. 点击 **"Update Product"** 保存

### 3. 图片要求

| 项目 | 要求 |
|------|------|
| **数量** | 1-5 张 |
| **格式** | JPG, PNG, WEBP, GIF |
| **大小** | 每张最大 5MB |
| **推荐尺寸** | 1200x1200 像素 |
| **主图** | 第一张图片自动设为主图 |

## 🔧 配置图片存储

### 开发环境

默认使用 **Base64 临时方案**，图片以 base64 格式存储在数据库中。

**优点**：
- 无需配置
- 立即可用

**缺点**：
- 性能较差
- 数据库体积大
- 不推荐生产环境使用

### 生产环境 - 方案 A：Cloudinary（推荐）

#### 1. 注册 Cloudinary 账号

访问：https://cloudinary.com/
- 免费计划：25GB 存储 + 25GB 带宽/月

#### 2. 获取 API 凭证

登录后，在 Dashboard 中找到：
- Cloud Name
- API Key
- API Secret

#### 3. 配置 Netlify 环境变量

在 Netlify 项目设置中添加：

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### 4. 安装依赖（已包含在 package.json）

```bash
npm install cloudinary
```

#### 5. 特性

- ✅ 自动生成缩略图
- ✅ 全球 CDN 加速
- ✅ 图片自动优化
- ✅ 按需转换格式
- ✅ 图片管理面板

### 生产环境 - 方案 B：Netlify Blobs

#### 1. 无需配置

Netlify Blobs 在部署到 Netlify 后自动可用。

#### 2. 限制

- 免费计划：10GB 存储
- 付费计划：按使用量计费

#### 3. 特性

- ✅ 无需额外配置
- ✅ 自动备份
- ✅ 安全存储
- ⚠️ 不自动生成缩略图
- ⚠️ 无图片优化

## 🔄 存储方案选择逻辑

系统会按以下顺序尝试存储方案：

```
1. Cloudinary (如果配置了环境变量)
   ↓ 失败
2. Netlify Blobs (自动检测)
   ↓ 失败
3. Base64 临时方案 (开发模式)
```

## 📊 图片上传流程

```
用户选择文件
    ↓
前端验证 (类型、大小、数量)
    ↓
转换为 Base64
    ↓
调用上传接口 /.netlify/functions/upload-image
    ↓
后端验证权限 (JWT Token)
    ↓
上传到存储服务 (Cloudinary/Blobs)
    ↓
返回图片 URL
    ↓
前端显示预览
    ↓
提交商品表单
    ↓
保存到数据库
```

## 🔍 API 接口详情

### 上传图片接口

**端点**：`POST /.netlify/functions/upload-image`

**请求头**：
```http
Content-Type: application/json
Authorization: Bearer <admin-token>
```

**请求体**：
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "fileName": "product-1.jpg",
  "mimeType": "image/jpeg"
}
```

**成功响应**：
```json
{
  "success": true,
  "data": {
    "imageUrl": "https://res.cloudinary.com/.../image.jpg",
    "thumbnailUrl": "https://res.cloudinary.com/.../image-thumb.jpg",
    "publicId": "pickball-products/abc123",
    "width": 1200,
    "height": 1200
  },
  "message": "图片上传成功"
}
```

**错误响应**：
```json
{
  "success": false,
  "error": "Image data is required",
  "code": 400
}
```

## 🐛 常见问题

### Q: 上传提示 "文件太大"？
**A**: 每张图片限制 5MB，请压缩图片后再上传。推荐使用：
- https://tinypng.com/
- https://squoosh.app/

### Q: 上传后没有缩略图？
**A**: 如果使用 Netlify Blobs，不会自动生成缩略图。建议：
1. 配置 Cloudinary
2. 或使用前端图片压缩库

### Q: 开发环境图片加载慢？
**A**: Base64 方案会增加数据库体积，建议：
1. 配置 Cloudinary（免费计划足够开发使用）
2. 或使用较小的测试图片

### Q: 生产环境应该用哪个方案？
**A**: 
- **推荐 Cloudinary**：功能完整，性能好
- **备选 Netlify Blobs**：简单，无需配置

### Q: 可以批量上传吗？
**A**: 可以，一次选择多个文件（最多5张）。

### Q: 如何修改上传限制？
**A**: 修改以下文件：

**前端限制** (`src/components/admin/ProductForm.vue`):
```javascript
// 修改最大图片数量
if (productImages.value.length + files.length > 5) {  // 改为你需要的数量
  
// 修改文件大小限制
if (file.size > 5 * 1024 * 1024) {  // 改为你需要的大小 (字节)
```

**后端处理** (`netlify/functions/upload-image.js`):
```javascript
// 在 Cloudinary 配置中修改
transformation: [
  { width: 1200, height: 1200, crop: 'limit', quality: 'auto' }
]
```

## 📝 技术实现细节

### 前端组件

**文件位置**：`src/components/admin/ProductForm.vue`

**关键功能**：
- 文件选择和验证
- Base64 转换
- 图片预览
- 上传进度管理
- 删除图片

### 后端接口

**文件位置**：`netlify/functions/upload-image.js`

**关键功能**：
- JWT 认证验证
- 图片数据解析
- 三种存储方案实现
- 错误处理
- 图片优化（Cloudinary）

### 数据库存储

**表**：`product_images`

**字段**：
- `image_url` - 图片完整URL
- `thumbnail_url` - 缩略图URL
- `alt_text` - 图片描述
- `sort_order` - 显示顺序
- `is_primary` - 是否主图

## 🚀 性能优化建议

1. **配置 CDN**：使用 Cloudinary 自动获得全球 CDN
2. **图片压缩**：上传前先压缩图片
3. **懒加载**：前台商品列表使用懒加载
4. **响应式图片**：根据设备加载不同尺寸
5. **缓存策略**：配置浏览器缓存

## 📞 支持

如有问题，请查看：
- 主文档：`STAGE4_ADMIN_COMPLETE.md`
- 设计文档：`design/design.md`
- 管理员指南：`ADMIN_GUIDE.md`

