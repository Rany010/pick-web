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
    console.log(`🔍 [get-image] 请求图片 key: ${key}`)
    const store = getStore('product-images')
    
    // 先检查文件是否存在
    console.log(`🔍 [get-image] 获取 metadata...`)
    const metadata = await store.getMetadata(key)
    if (!metadata) {
      console.warn(`⚠️ [get-image] 图片不存在: ${key}`)
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Image not found', key }),
      }
    }
    console.log(`🔍 [get-image] metadata:`, JSON.stringify(metadata))

    // 获取文件内容
    console.log(`🔍 [get-image] 获取 blob 内容...`)
    const blob = await store.get(key, { type: 'blob' })

    if (!blob) {
      console.warn(`⚠️ [get-image] Blob 为空: ${key}`)
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Image not found', key }),
      }
    }

    // 确定 Content-Type
    const contentType = metadata.metadata?.contentType || 'image/jpeg'

    // 将 Blob 转换为 Buffer
    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log(`✅ [get-image] 成功获取图片: ${key}, 类型: ${contentType}, 大小: ${buffer.length} bytes`)

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': buffer.length.toString()
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true,
    }
  } catch (error) {
    console.error(`❌ [get-image] 获取图片失败 key=${key}:`, error.message)
    console.error(`❌ [get-image] 错误堆栈:`, error.stack)
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

