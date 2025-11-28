# 图片存储优化说明

## 📋 优化概述

本次优化确保所有产品图片和首页轮播图都统一存储在 Netlify Blobs 中，数据库只存储 `blobKey`（文件名），而不是完整 URL 或 base64 数据。这样可以：

- ✅ 减少数据库体积
- ✅ 提高查询性能
- ✅ 统一图片管理
- ✅ 支持大量图片存储

## 🔧 主要改动

### 1. 创建统一的图片处理工具函数

**文件**: `netlify/functions/utils/image.js`

提供了以下工具函数：
- `isBlobKey(url)` - 判断是否为 blobKey
- `extractBlobKey(url)` - 从完整 URL 中提取 blobKey
- `getImageUrl(blobKey, context)` - 将 blobKey 转换为完整 URL
- `normalizeImageUrl(url)` - 规范化图片 URL，确保只存储 blobKey
- `normalizeProductImages(images)` - 规范化产品图片数组
- `processProductImages(product, context)` - 处理产品数据，将 blobKey 转换为完整 URL
- `processBannerImage(banner, context)` - 处理 Banner 数据
- `processBannerImages(banners, context)` - 处理 Banner 数组

### 2. 优化后端 API

#### 产品相关 API
- ✅ `admin-product-create.js` - 创建产品时，规范化图片 URL，只存储 blobKey
- ✅ `admin-product-update.js` - 更新产品时，规范化图片 URL，只存储 blobKey
- ✅ `products-list.js` - 返回产品列表时，将 blobKey 转换为完整 URL
- ✅ `product-detail.js` - 返回产品详情时，将 blobKey 转换为完整 URL
- ✅ `admin-products-list.js` - 管理员产品列表，将 blobKey 转换为完整 URL
- ✅ `admin-product-detail.js` - 管理员产品详情，将 blobKey 转换为完整 URL

#### Banner 相关 API
- ✅ `admin-banner-create.js` - 创建 Banner 时，规范化图片 URL，只存储 blobKey
- ✅ `admin-banner-update.js` - 更新 Banner 时，规范化图片 URL，只存储 blobKey
- ✅ `banners-list.js` - 返回 Banner 列表时，将 blobKey 转换为完整 URL

### 3. 优化前端组件

#### ProductForm 组件
- ✅ 添加 `getImageUrl()` 函数，用于显示图片时将 blobKey 转换为完整 URL
- ✅ 添加 `extractBlobKey()` 函数，从 API 返回的完整 URL 中提取 blobKey
- ✅ 上传图片后，存储 blobKey 而不是完整 URL
- ✅ 加载产品数据时，从完整 URL 中提取 blobKey 存储
- ✅ 显示图片时，使用 `getImageUrl()` 转换为完整 URL

#### BannerManage 组件
- ✅ 添加 `extractBlobKey()` 函数
- ✅ 加载 Banner 数据时，从完整 URL 中提取 blobKey 存储
- ✅ 显示图片时，使用 `getImageUrl()` 转换为完整 URL

## 📊 数据流程

### 图片上传流程
1. 前端上传图片 → `upload-image.js`
2. 图片存储到 Netlify Blobs → 返回 `blobKey`
3. 前端存储 `blobKey` 到表单数据
4. 提交表单 → 后端 API
5. 后端规范化 URL，确保只存储 `blobKey` → 保存到数据库

### 图片显示流程
1. 从数据库读取 `blobKey`
2. 后端 API 将 `blobKey` 转换为完整 URL → 返回给前端
3. 前端直接使用完整 URL 显示图片

### 图片编辑流程
1. 从 API 获取完整 URL
2. 前端提取 `blobKey` 存储到表单
3. 显示时转换为完整 URL
4. 提交时只发送 `blobKey`

## 🔍 数据库存储格式

### 之前（问题）
```sql
-- ProductImage 表
imageUrl: "https://site.netlify.app/.netlify/functions/get-image?key=1234567890-abc123.jpg"
-- 或
imageUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABA..."

-- Banner 表
imageUrl: "https://site.netlify.app/.netlify/functions/get-image?key=banner-1-1234567890.jpg"
```

### 现在（优化后）
```sql
-- ProductImage 表
imageUrl: "1234567890-abc123.jpg"  -- 只存储 blobKey

-- Banner 表
imageUrl: "banner-1-1234567890.jpg"  -- 只存储 blobKey
```

## 🚀 使用说明

### 上传图片
```javascript
// 前端上传
const response = await uploadImage({
  image: base64Data,
  fileName: 'image.jpg',
  mimeType: 'image/jpeg'
})

// 返回结果
{
  success: true,
  data: {
    blobKey: "1234567890-abc123.jpg",  // 存储这个
    imageUrl: "1234567890-abc123.jpg",  // 同上
    storage: 'netlify-blobs'
  }
}
```

### 显示图片
```javascript
// 前端显示
const getImageUrl = (blobKey) => {
  if (!blobKey) return '/placeholder.svg'
  if (blobKey.startsWith('http') || blobKey.startsWith('data:')) {
    return blobKey  // 已经是完整 URL
  }
  return `/.netlify/functions/get-image?key=${encodeURIComponent(blobKey)}`
}

// 使用
<img :src="getImageUrl(product.imageUrl)" />
```

### 后端处理
```javascript
// 存储时：规范化 URL
import { normalizeImageUrl } from './utils/image.js'
const blobKey = normalizeImageUrl(data.imageUrl)  // 提取 blobKey

// 返回时：转换为完整 URL
import { processProductImages } from './utils/image.js'
const processed = processProductImages(product, context)  // 转换 blobKey 为完整 URL
```

## ✅ 验证清单

- [x] 所有产品图片存储在 Netlify Blobs
- [x] 所有 Banner 图片存储在 Netlify Blobs
- [x] 数据库只存储 blobKey
- [x] API 返回时统一转换为完整 URL
- [x] 前端正确显示图片
- [x] 前端正确提取和存储 blobKey
- [x] 图片上传流程正常
- [x] 图片编辑流程正常

## 📝 注意事项

1. **迁移现有数据**: 如果数据库中有旧的完整 URL 或 base64 数据，需要运行迁移脚本：
   ```bash
   npm run migrate:images
   ```

2. **本地开发**: 使用 `netlify dev` 启动本地开发服务器，确保 Netlify Blobs 正常工作。

3. **环境变量**: 确保在 Netlify 部署环境中设置了 `DATABASE_URL` 环境变量。

4. **图片访问**: 所有图片通过 `/.netlify/functions/get-image?key=xxx` 访问，支持缓存优化。

## 🔄 后续优化建议

- [ ] 添加图片压缩和优化
- [ ] 实现多尺寸缩略图生成
- [ ] 添加图片格式转换（WebP 支持）
- [ ] 实现图片懒加载
- [ ] 添加图片 CDN 支持

