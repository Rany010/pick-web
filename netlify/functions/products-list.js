import prismaModule from './utils/db.js'
import { success, error, options } from './utils/response.js'

const prisma = prismaModule.default || prismaModule

/**
 * 获取商品列表
 * GET /api/products-list?category=paddles&limit=10&offset=0
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
    const params = event.queryStringParameters || {}
    const category = params.category || 'all'
    const limit = parseInt(params.limit) || 100
    const offset = parseInt(params.offset) || 0

    console.log(`📦 查询商品列表 - 分类: ${category}, limit: ${limit}, offset: ${offset}`)

    // 构建查询条件
    const where = {
      status: 'active' // 只返回已发布的商品
    }

    // 如果指定了分类，添加分类筛选
    if (category && category !== 'all') {
      const categoryRecord = await prisma.category.findFirst({
        where: { slug: category }
      })
      
      if (categoryRecord) {
        where.categoryId = categoryRecord.id
      }
    }

    // 查询商品
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' }
        },
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit,
      skip: offset
    })

    // 获取总数
    const total = await prisma.product.count({ where })

    console.log(`✅ 成功查询到 ${products.length} 个商品，总数: ${total}`)

    return success(
      {
        products,
        total,
        limit,
        offset
      },
      `成功获取 ${products.length} 个商品`
    )
  } catch (err) {
    console.error('❌ 查询商品列表失败:', err)
    return error(
      '获取商品列表失败',
      500,
      process.env.NODE_ENV === 'development' ? err.message : undefined
    )
  }
}

