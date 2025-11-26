import { success, error, options } from './utils/response.js'
import { requireAuth } from './utils/auth.js'

/**
 * 上传图片（管理员）
 * POST /api/upload-image
 * 
 * 说明：
 * 1. 优先使用 Netlify Blobs 存储图片
 * 2. 备选方案：Cloudinary（需要配置环境变量）
 * 3. 最后回退：base64（仅用于开发调试）
 */
export const handler = async (event, context) => {
  // 处理 OPTIONS 请求（CORS 预检）
  if (event.httpMethod === 'OPTIONS') {
    return options()
  }

  // 只允许 POST 请求
  if (event.httpMethod !== 'POST') {
    return error('Method not allowed', 405)
  }

  try {
    // 验证权限
    const auth = requireAuth(event)
    if (!auth.isAuthorized) {
      return error(auth.error, 401)
    }

    const contentType = event.headers['content-type'] || event.headers['Content-Type']
    
    // 处理 multipart/form-data 或 base64 数据
    if (!event.body) {
      return error('No image data provided', 400)
    }

    // 解析请求数据
    let imageData, fileName, mimeType

    try {
      // 尝试解析为 JSON（base64 格式）
      const data = JSON.parse(event.body)
      imageData = data.image // base64 字符串
      fileName = data.fileName || `product-${Date.now()}.jpg`
      mimeType = data.mimeType || 'image/jpeg'
    } catch {
      return error('Invalid image data format. Expected JSON with base64 image.', 400)
    }

    if (!imageData) {
      return error('Image data is required', 400)
    }

    console.log(`📸 上传图片 - 文件名: ${fileName}`)

    // ============================================
    // 方案 1: 优先使用 Netlify Blobs
    // ============================================
    try {
      // 动态导入 @netlify/blobs
      const { getStore } = await import('@netlify/blobs')
      
      // 获取存储实例 (store name: 'product-images')
      const store = getStore('product-images')
      
      // 准备数据：从 base64 转换为 Buffer
      // data:image/jpeg;base64,/9j/4AAQSkZJRgABA...
      const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
      
      let buffer
      if (matches && matches.length === 3) {
        // 如果有前缀，去掉前缀
        mimeType = matches[1] || mimeType
        buffer = Buffer.from(matches[2], 'base64')
      } else {
        // 如果没有前缀，直接转换
        buffer = Buffer.from(imageData, 'base64')
      }
      
      // 生成唯一文件名
      const randomString = Math.random().toString(36).substring(2, 15)
      const extension = mimeType.split('/')[1] || 'jpg'
      const uniqueFileName = `${Date.now()}-${randomString}.${extension}`
      
      // 上传到 Netlify Blobs
      await store.set(uniqueFileName, buffer, {
        metadata: {
          contentType: mimeType,
          originalName: fileName,
          uploadedAt: new Date().toISOString()
        }
      })

      // 只返回 blobKey，前端根据需要构造完整 URL
      // 这样可以避免本地/生产环境 URL 不一致的问题
      console.log(`✅ [upload-image] Netlify Blobs 上传成功: ${uniqueFileName}`)

      return success({
        imageUrl: uniqueFileName,  // 只存 key，前端/后端根据需要构造完整 URL
        thumbnailUrl: uniqueFileName, 
        blobKey: uniqueFileName,
        fileName: uniqueFileName,
        storage: 'netlify-blobs',
        mimeType: mimeType
      }, '图片上传成功')
      
    } catch (blobError) {
      console.warn('⚠️ Netlify Blobs 上传失败:', blobError)
      // 继续尝试其他方案
    }

    // ============================================
    // 方案 2: 使用 Cloudinary (需要配置环境变量)
    // ============================================
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      const cloudinary = await import('cloudinary').then(m => m.v2)
      
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      })

      try {
        const uploadResult = await cloudinary.uploader.upload(imageData, {
          folder: 'pickball-products',
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit', quality: 'auto' }
          ]
        })

        // 生成缩略图URL
        const thumbnailUrl = cloudinary.url(uploadResult.public_id, {
          width: 400,
          height: 400,
          crop: 'fill',
          quality: 'auto'
        })

        console.log(`✅ Cloudinary 上传成功: ${uploadResult.secure_url}`)

        return success({
          imageUrl: uploadResult.secure_url,
          thumbnailUrl: thumbnailUrl,
          publicId: uploadResult.public_id,
          width: uploadResult.width,
          height: uploadResult.height
        }, '图片上传成功')
      } catch (uploadError) {
        console.error('Cloudinary 上传失败:', uploadError)
        return error('图片上传失败: ' + uploadError.message, 500)
      }
    }


    // ============================================
    // 方案 3: 临时方案 (已移除)
    // 如果上面的方案都失败，直接报错
    // ============================================
    
    // 如果执行到这里，说明所有上传方案都失败了
    // 检查是否是因为配置缺失
    const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY
    
    let errorMessage = '图片上传失败：'
    if (!isCloudinaryConfigured) {
      errorMessage += 'Netlify Blobs 上传失败，且未配置 Cloudinary。'
    } else {
      errorMessage += 'Netlify Blobs 和 Cloudinary 上传均失败。'
    }
    
    console.error('❌ [upload-image] 所有存储方案均失败')
    return error(errorMessage + ' 请检查 Netlify Blobs 配置或环境变量。', 500)

  } catch (err) {
    console.error('❌ 上传图片失败:', err)
    return error(
      '上传图片失败',
      500,
      process.env.NODE_ENV === 'development' ? err.message : undefined
    )
  }
}

