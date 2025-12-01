import { getStore } from '@netlify/blobs'

/**
 * 获取图片（通过 Netlify Blobs）
 * GET /.netlify/functions/get-image?key=xxx
 */
export const handler = async (event, context) => {
  // 处理 CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  const { key } = event.queryStringParameters || {}

  if (!key) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing key parameter' }),
    }
  }

  try {
    // 优化：减少日志输出，提升性能
    console.log(`🔍 [get-image] 请求图片 key: ${key}`)
    
    // 显式传递 siteID 和 token 以解决环境配置问题
    const store = getStore({
        name: 'product-images',
        siteID: process.env.NETLIFY_SITE_ID || process.env.SITE_ID,
        token: process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN
    })
    
    // 检查客户端缓存 - 支持 If-None-Match（ETag）
    const clientETag = event.headers['if-none-match']
    const eTag = `"${key}"` // 使用 key 作为 ETag
    
    if (clientETag === eTag) {
      console.log(`✅ [get-image] 命中客户端缓存: ${key}`)
      return {
        statusCode: 304,
        headers: {
          ...headers,
          'ETag': eTag,
          'Cache-Control': 'public, max-age=31536000, immutable'
        },
        body: ''
      }
    }
    
    // 优化：先获取 blob，只在失败时才获取 metadata
    const blob = await store.get(key, { type: 'blob' })

    if (!blob) {
      console.warn(`⚠️ [get-image] 图片不存在: ${key}`)
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Image not found', key }),
      }
    }

    // 从文件扩展名推断 Content-Type（避免额外的 metadata 查询）
    let contentType = 'image/jpeg'
    if (key.endsWith('.png')) contentType = 'image/png'
    else if (key.endsWith('.gif')) contentType = 'image/gif'
    else if (key.endsWith('.webp')) contentType = 'image/webp'
    else if (key.endsWith('.svg')) contentType = 'image/svg+xml'

    // 将 Blob 转换为 Buffer
    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log(`✅ [get-image] 成功获取图片: ${key}, 大小: ${buffer.length} bytes`)

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // 1年缓存
        'ETag': eTag,
        'Content-Length': buffer.length.toString(),
        'Vary': 'Accept-Encoding' // 支持压缩
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true,
    }
  } catch (error) {
    console.error(`❌ [get-image] 获取图片失败 key=${key}:`, error.message)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal Server Error',
        key,
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
    }
  }
}

