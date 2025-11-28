import prismaModule from './utils/db.js'
import { success, error, options } from './utils/response.js'
import { requireAuth } from './utils/auth.js'
import { processProductImages } from './utils/image.js'

const prisma = prismaModule.default || prismaModule

/**
 * 获取商品列表（管理员）
 * GET /api/admin-products-list?category=&status=&search=&limit=20&offset=0
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
    // 验证权限
    const auth = requireAuth(event)
    if (!auth.isAuthorized) {
      return error(auth.error, 401)
    }

    const params = event.queryStringParameters || {}
    const category = params.category || ''
    const status = params.status || ''
    const search = params.search || ''
    const limit = parseInt(params.limit) || 20
    const offset = parseInt(params.offset) || 0

    console.log(`📦 管理员查询商品列表 - 分类: ${category}, 状态: ${status}, 搜索: ${search}`)

    // 构建查询条件
    const where = {}

    // 分类筛选
    if (category) {
      const categoryRecord = await prisma.category.findFirst({
        where: { slug: category }
      })
      if (categoryRecord) {
        where.categoryId = categoryRecord.id
      }
    }

    // 状态筛选
    if (status) {
      where.status = status
    }

    // 搜索
    if (search) {
      where.OR = [
        { nameEn: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
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
        { createdAt: 'desc' }
      ],
      take: limit,
      skip: offset
    })

    // 获取总数
    const total = await prisma.product.count({ where })

    // 处理产品图片 URL，将 blobKey 转换为完整 URL
    const processedProducts = products.map(product => processProductImages(product, context))

    console.log(`✅ 成功查询到 ${products.length} 个商品，总数: ${total}`)

    return success(
      {
        products: processedProducts,
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

