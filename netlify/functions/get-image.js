import { getStore } from '@netlify/blobs'

export const handler = async (event, context) => {
  const { key } = event.queryStringParameters

  if (!key) {
    return {
      statusCode: 400,
      body: 'Missing key parameter',
    }
  }

  try {
    const store = getStore('product-images')
    const blob = await store.get(key, { type: 'blob' })

    if (!blob) {
      return {
        statusCode: 404,
        body: 'Image not found',
      }
    }

    // 获取 metadata 以确定 Content-Type
    const { metadata } = await store.getMetadata(key)
    const contentType = metadata?.contentType || 'image/jpeg'

    // 将 Blob 转换为 Buffer
    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true,
    }
  } catch (error) {
    console.error('Error getting image:', error)
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    }
  }
}

