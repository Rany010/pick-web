import prismaModule from './utils/db.js'
import { success, error, options } from './utils/response.js'

const prisma = prismaModule.default || prismaModule

/**
 * 获取分类列表
 * GET /api/categories-list
 */
export const handler = async (event, context) => {
  // 处理 OPTIONS 请求（CORS 预检）
  if (event.httpMethod === 'OPTIONS') {
    return options()
  }

  // 只允许 GET 请求
  if (event.httpMethod !== 'GET') {
    return error('Method not allowed', 405)
  }

  try {
    console.log('📦 查询分类列表')

    // 查询所有启用的分类
    const categories = await prisma.category.findMany({
      where: {
        isActive: true
      },
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        sortOrder: 'asc'
      }
    })

    console.log(`✅ 成功查询到 ${categories.length} 个分类`)

    return success(categories, `成功获取 ${categories.length} 个分类`)
  } catch (err) {
    console.error('❌ 查询分类列表失败:', err)
    return error(
      '获取分类列表失败',
      500,
      process.env.NODE_ENV === 'development' ? err.message : undefined
    )
  }
}

