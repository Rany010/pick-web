import prismaModule from './utils/db.js'
import { success, error, options } from './utils/response.js'
import { requireAuth } from './utils/auth.js'
import { processBannerImages } from './utils/image.js'

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
    console.log('🔍 [banners-list] 开始获取 Banner 列表...')
    
    // 如果是后台管理调用，需要验证权限
    const authHeader = event.headers.authorization || event.headers.Authorization
    let isAdmin = false
    
    if (authHeader) {
      const auth = requireAuth(event)
      if (auth.isAuthorized) {
        isAdmin = true
      }
    }
    console.log(`🔍 [banners-list] 是否管理员: ${isAdmin}`)

    let where = {}
    // 非管理员只能看到激活的且在有效期内的
    if (!isAdmin) {
      const now = new Date()
      console.log(`🔍 [banners-list] 当前时间: ${now.toISOString()}`)
      where = {
        isActive: true,
        AND: [
          {
            OR: [
              { startDate: null },
              { startDate: { lte: now } }
            ]
          },
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } }
            ]
          }
        ]
      }
    }

    console.log(`🔍 [banners-list] 查询条件:`, JSON.stringify(where))

    const banners = await prisma.banner.findMany({
      where,
      orderBy: {
        sortOrder: 'asc'
      }
    })

    console.log(`📊 [banners-list] 查询到 ${banners.length} 个 Banner${isAdmin ? '（管理员视图）' : '（用户视图）'}`)
    
    // 处理 Banner 图片 URL，将 blobKey 转换为完整 URL
    const processedBanners = processBannerImages(banners, context)
    
    // 打印每个 banner 的详情用于调试
    processedBanners.forEach((b, i) => {
      console.log(`📊 [banners-list] Banner ${i + 1}: id=${b.id}, title="${b.title}", isActive=${b.isActive}, imageUrl=${b.imageUrl?.substring(0, 50)}...`)
    })

    return success(processedBanners)
  } catch (err) {
    console.error('❌ [banners-list] 获取 Banner 列表失败:', err.message)
    console.error('❌ [banners-list] 错误堆栈:', err.stack)
    return error('获取 Banner 列表失败', 500)
  }
}

