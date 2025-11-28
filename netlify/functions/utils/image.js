/**
 * 图片 URL 处理工具函数
 * 统一处理 Netlify Blobs 图片的存储和访问
 */

/**
 * 判断是否为 blobKey（不是完整 URL 或 base64）
 * @param {string} url - 图片 URL 或 blobKey
 * @returns {boolean}
 */
export function isBlobKey(url) {
  if (!url || typeof url !== 'string') return false
  
  // 如果是 base64 数据，不是 blobKey
  if (url.startsWith('data:image')) return false
  
  // 如果是完整 URL（http/https），不是 blobKey
  if (url.startsWith('http://') || url.startsWith('https://')) return false
  
  // 如果是相对路径（以 / 开头），不是 blobKey
  if (url.startsWith('/')) return false
  
  // 其他情况认为是 blobKey
  return true
}

/**
 * 从完整 URL 中提取 blobKey
 * @param {string} url - 完整 URL 或 blobKey
 * @returns {string} - blobKey
 */
export function extractBlobKey(url) {
  if (!url || typeof url !== 'string') return url
  
  // 如果已经是 blobKey，直接返回
  if (isBlobKey(url)) return url
  
  // 如果是完整 URL，尝试提取 key 参数
  try {
    const urlObj = new URL(url)
    const key = urlObj.searchParams.get('key')
    if (key) return key
  } catch (e) {
    // 不是有效 URL，可能是相对路径
  }
  
  // 如果是相对路径，尝试提取 key
  if (url.includes('get-image?key=')) {
    const match = url.match(/[?&]key=([^&]+)/)
    if (match && match[1]) {
      return decodeURIComponent(match[1])
    }
  }
  
  // 无法提取，返回原值
  return url
}

/**
 * 将 blobKey 转换为完整的访问 URL
 * @param {string} blobKey - blobKey
 * @param {object} context - Netlify Functions context（可选）
 * @returns {string} - 完整 URL
 */
export function getImageUrl(blobKey, context = null) {
  if (!blobKey || typeof blobKey !== 'string') return ''
  
  // 如果已经是完整 URL 或 base64，直接返回
  if (blobKey.startsWith('http://') || blobKey.startsWith('https://') || blobKey.startsWith('data:image')) {
    return blobKey
  }
  
  // 如果是相对路径，直接返回
  if (blobKey.startsWith('/')) {
    return blobKey
  }
  
  // 构造 Netlify Functions URL
  // 在生产环境中，使用环境变量或从 context 获取
  const baseUrl = context?.site?.url || 
                  process.env.URL || 
                  process.env.DEPLOY_PRIME_URL || 
                  'http://localhost:8888'
  
  return `${baseUrl}/.netlify/functions/get-image?key=${encodeURIComponent(blobKey)}`
}

/**
 * 规范化图片 URL：确保数据库只存储 blobKey
 * @param {string} url - 图片 URL（可能是完整 URL、blobKey 或 base64）
 * @returns {string} - blobKey
 */
export function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') return ''
  
  // 如果是 base64，返回空（需要先上传到 Blobs）
  if (url.startsWith('data:image')) {
    console.warn('⚠️ 检测到 base64 图片，需要先上传到 Netlify Blobs')
    return ''
  }
  
  // 提取 blobKey
  return extractBlobKey(url)
}

/**
 * 处理产品图片数组，规范化所有图片 URL
 * @param {Array} images - 图片数组
 * @returns {Array} - 规范化后的图片数组
 */
export function normalizeProductImages(images) {
  if (!Array.isArray(images)) return []
  
  return images.map(img => {
    if (typeof img === 'string') {
      return {
        imageUrl: normalizeImageUrl(img),
        thumbnailUrl: normalizeImageUrl(img)
      }
    }
    
    return {
      imageUrl: normalizeImageUrl(img.imageUrl || img.url || ''),
      thumbnailUrl: normalizeImageUrl(img.thumbnailUrl || img.thumbUrl || img.imageUrl || img.url || ''),
      altText: img.altText || img.alt || '',
      sortOrder: img.sortOrder || img.order || 0,
      isPrimary: img.isPrimary || false
    }
  })
}

/**
 * 处理产品数据，将图片 URL 转换为完整 URL（用于 API 返回）
 * @param {object} product - 产品对象
 * @param {object} context - Netlify Functions context（可选）
 * @returns {object} - 处理后的产品对象
 */
export function processProductImages(product, context = null) {
  if (!product) return product
  
  const processed = { ...product }
  
  // 处理产品图片数组
  if (processed.images && Array.isArray(processed.images)) {
    processed.images = processed.images.map(img => ({
      ...img,
      imageUrl: img.imageUrl ? getImageUrl(img.imageUrl, context) : '',
      thumbnailUrl: img.thumbnailUrl ? getImageUrl(img.thumbnailUrl, context) : (img.imageUrl ? getImageUrl(img.imageUrl, context) : '')
    }))
  }
  
  return processed
}

/**
 * 处理 Banner 数据，将图片 URL 转换为完整 URL（用于 API 返回）
 * @param {object} banner - Banner 对象
 * @param {object} context - Netlify Functions context（可选）
 * @returns {object} - 处理后的 Banner 对象
 */
export function processBannerImage(banner, context = null) {
  if (!banner) return banner
  
  const processed = { ...banner }
  
  if (processed.imageUrl) {
    processed.imageUrl = getImageUrl(processed.imageUrl, context)
  }
  
  return processed
}

/**
 * 处理 Banner 数组
 * @param {Array} banners - Banner 数组
 * @param {object} context - Netlify Functions context（可选）
 * @returns {Array} - 处理后的 Banner 数组
 */
export function processBannerImages(banners, context = null) {
  if (!Array.isArray(banners)) return banners
  
  return banners.map(banner => processBannerImage(banner, context))
}

