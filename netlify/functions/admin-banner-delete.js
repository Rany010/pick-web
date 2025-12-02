import prismaModule from './utils/db.js'
import { success, error, options } from './utils/response.js'
import { requireAuth } from './utils/auth.js'
import { deleteBlob } from './utils/image.js'

const prisma = prismaModule.default || prismaModule

/**
 * 删除 Banner (管理员)
 * DELETE /api/admin-banner-delete
 */
export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return options()
  }

  if (event.httpMethod !== 'DELETE') {
    return error('Method not allowed', 405)
  }

  try {
    const auth = requireAuth(event)
    if (!auth.isAuthorized) {
      return error(auth.error, 401)
    }

    const { id } = event.queryStringParameters

    if (!id) {
      return error('Banner ID is required', 400)
    }

    const bannerId = parseInt(id)
    
    // 获取 Banner 信息（包括图片）
    const existingBanner = await prisma.banner.findUnique({
      where: { id: bannerId }
    })

    if (!existingBanner) {
      return error('Banner not found', 404)
    }

    console.log(`🗑️ 准备删除轮播图: ${existingBanner.title || 'Untitled'}`)

    // 先删除 Netlify Blob 中的图片
    if (existingBanner.imageUrl) {
      const deleted = await deleteBlob(existingBanner.imageUrl)
      if (deleted) {
        console.log(`✅ 已删除轮播图图片 Blob`)
      }
    }

    // 删除数据库记录
    await prisma.banner.delete({
      where: { id: bannerId }
    })

    console.log(`✅ 成功删除轮播图`)

    return success({ id }, 'Banner deleted successfully')
  } catch (err) {
    console.error('❌ 删除 Banner 失败:', err)
    return error('删除 Banner 失败', 500)
  }
}

