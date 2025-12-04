import prismaModule from './utils/db.js'
import { success, error, options } from './utils/response.js'
import { processProductImages } from './utils/image.js'

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
    const startTime = Date.now()
    const params = event.queryStringParameters || {}
    const category = params.category || 'all'
    const limit = Math.min(parseInt(params.limit) || 20, 50) // 限制最大50条，默认20条
    const offset = parseInt(params.offset) || 0

    console.log(`📦 [products-list] 查询商品列表 - 分类: ${category}, limit: ${limit}, offset: ${offset}`)

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

    // 查询商品（优化：列表页只加载第一张图片）
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
          take: 1 // 列表页只需要第一张图片，减少数据传输
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

    // 处理产品图片 URL，将 blobKey 转换为完整 URL
    const processedProducts = products.map(product => processProductImages(product, context))

    console.log(`✅ [products-list] 成功查询到 ${products.length} 个商品，总数: ${total}，耗时: ${Date.now() - startTime}ms`)

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
    console.error('❌ [products-list] 查询商品列表失败:', err.message)
    console.error('❌ [products-list] 错误堆栈:', err.stack)
    return error(
      '获取商品列表失败',
      500,
      process.env.NODE_ENV === 'development' ? err.message : undefined
    )
  }
}

