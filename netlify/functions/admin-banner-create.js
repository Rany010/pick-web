import prismaModule from './utils/db.js'
import { success, error, options } from './utils/response.js'
import { requireAuth } from './utils/auth.js'

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

    const banner = await prisma.banner.create({
      data: {
        title: data.title,
        subtitle: data.subtitle || null,
        imageUrl: data.imageUrl,
        linkUrl: data.linkUrl || null,
        buttonText: data.buttonText || null,
        sortOrder: data.sortOrder || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null
      }
    })

    return success(banner, 'Banner created successfully')
  } catch (err) {
    console.error('❌ 创建 Banner 失败:', err)
    return error('创建 Banner 失败', 500)
  }
}

