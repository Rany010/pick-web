import prismaModule from './utils/db.js'
import { success, error, options } from './utils/response.js'
import { requireAuth } from './utils/auth.js'

const prisma = prismaModule.default || prismaModule

/**
 * 更新 Banner (管理员)
 * PUT /api/admin-banner-update
 */
export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return options()
  }

  if (event.httpMethod !== 'PUT') {
    return error('Method not allowed', 405)
  }

  try {
    const auth = requireAuth(event)
    if (!auth.isAuthorized) {
      return error(auth.error, 401)
    }

    const data = JSON.parse(event.body || '{}')
    const id = data.id

    if (!id) {
      return error('Banner ID is required', 400)
    }

    const updateData = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.subtitle !== undefined) updateData.subtitle = data.subtitle
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl
    if (data.linkUrl !== undefined) updateData.linkUrl = data.linkUrl
    if (data.buttonText !== undefined) updateData.buttonText = data.buttonText
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder
    if (data.isActive !== undefined) updateData.isActive = data.isActive
    if (data.startDate !== undefined) updateData.startDate = data.startDate ? new Date(data.startDate) : null
    if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null

    const banner = await prisma.banner.update({
      where: { id },
      data: updateData
    })

    return success(banner, 'Banner updated successfully')
  } catch (err) {
    console.error('❌ 更新 Banner 失败:', err)
    return error('更新 Banner 失败', 500)
  }
}

