import prismaModule from './utils/db.js'
import { success, error, options } from './utils/response.js'
import { requireAuth } from './utils/auth.js'

const prisma = prismaModule.default || prismaModule

/**
 * 获取 Banner 列表
 * GET /api/banners-list
 */
export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return options()
  }

  if (event.httpMethod !== 'GET') {
    return error('Method not allowed', 405)
  }

  try {
    // 如果是后台管理调用，需要验证权限
    // 这里简单处理：如果带了 Authorization 头，就作为管理员查询（返回所有，包括未激活的）
    // 否则只返回激活的
    const authHeader = event.headers.authorization || event.headers.Authorization
    let isAdmin = false
    
    if (authHeader) {
      const auth = requireAuth(event)
      if (auth.isAuthorized) {
        isAdmin = true
      }
    }

    const where = {}
    // 非管理员只能看到激活的且在有效期内的
    if (!isAdmin) {
      const now = new Date()
      where.isActive = true
      where.OR = [
        { startDate: null },
        { startDate: { lte: now } }
      ]
      where.AND = [
        { OR: [{ endDate: null }, { endDate: { gte: now } }] }
      ]
    }

    const banners = await prisma.banner.findMany({
      where,
      orderBy: {
        sortOrder: 'asc'
      }
    })

    return success(banners)
  } catch (err) {
    console.error('❌ 获取 Banner 列表失败:', err)
    return error('获取 Banner 列表失败', 500)
  }
}

