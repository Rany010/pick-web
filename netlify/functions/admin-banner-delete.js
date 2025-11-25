import prismaModule from './utils/db.js'
import { success, error, options } from './utils/response.js'
import { requireAuth } from './utils/auth.js'

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

    await prisma.banner.delete({
      where: { id: parseInt(id) }
    })

    return success({ id }, 'Banner deleted successfully')
  } catch (err) {
    console.error('❌ 删除 Banner 失败:', err)
    return error('删除 Banner 失败', 500)
  }
}

