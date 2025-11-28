import prismaModule from './utils/db.js'
import { success, error, options } from './utils/response.js'
import { requireAuth } from './utils/auth.js'
import { normalizeImageUrl, processBannerImage } from './utils/image.js'

const prisma = prismaModule.default || prismaModule

/**
 * 创建 Banner (管理员)
 * POST /api/admin-banner-create
 */
export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return options()
  }

  if (event.httpMethod !== 'POST') {
    return error('Method not allowed', 405)
  }

  try {
    const auth = requireAuth(event)
    if (!auth.isAuthorized) {
      return error(auth.error, 401)
    }

    const data = JSON.parse(event.body || '{}')

    if (!data.title || !data.imageUrl) {
      return error('Missing required fields: title, imageUrl', 400)
    }

    // 规范化图片 URL，确保只存储 blobKey
    const normalizedImageUrl = normalizeImageUrl(data.imageUrl)
    
    if (!normalizedImageUrl) {
      return error('Invalid image URL. Please upload image to Netlify Blobs first.', 400)
    }

    const banner = await prisma.banner.create({
      data: {
        title: data.title,
        subtitle: data.subtitle || null,
        imageUrl: normalizedImageUrl, // 只存储 blobKey
        linkUrl: data.linkUrl || null,
        buttonText: data.buttonText || null,
        sortOrder: data.sortOrder || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null
      }
    })

    // 处理图片 URL，返回完整 URL 给前端
    const processedBanner = processBannerImage(banner, context)

    return success(processedBanner, 'Banner created successfully')
  } catch (err) {
    console.error('❌ 创建 Banner 失败:', err)
    return error('创建 Banner 失败', 500)
  }
}

