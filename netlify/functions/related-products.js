import prismaModule from './utils/db.js'
import { success, error, options } from './utils/response.js'
import { processProductImages } from './utils/image.js'

const prisma = prismaModule.default || prismaModule

/**
 * 获取相关商品（同类别商品推荐）
 * GET /api/related-products?productId=1&limit=3
 * 
 * 优化说明：
 * 1. 直接在数据库层查询同类别商品，避免查询所有商品
 * 2. 只返回必要字段，减少数据传输
 * 3. 不包含 tags 关联，提升查询速度
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
    const productId = parseInt(params.productId)
    const limit = Math.min(parseInt(params.limit) || 3, 10) // 默认3个，最多10个

    if (!productId || isNaN(productId)) {
      return error('请提供有效的商品 ID', 400)
    }

    console.log(`🔗 [related-products] 查询相关商品 - 商品ID: ${productId}, limit: ${limit}`)

    // 第一步：获取当前商品的类别
    const currentProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true }
    })

    if (!currentProduct) {
      return error('商品不存在', 404)
    }

    if (!currentProduct.categoryId) {
      console.log(`⚠️ [related-products] 商品 ${productId} 没有分类，返回空列表`)
      return success([], '该商品没有关联分类')
    }

    // 第二步：查询同类别的其他商品（优化查询）
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: currentProduct.categoryId, // 同类别
        id: { not: productId }, // 排除当前商品
        status: 'active' // 只返回已发布的商品
      },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
          take: 1 // 只获取第一张图片，减少数据量
        }
        // 不包含 tags，提升查询速度
      },
      orderBy: [
        { isFeatured: 'desc' }, // 优先推荐精选商品
        { viewCount: 'desc' },  // 其次按浏览量排序
        { createdAt: 'desc' }   // 最后按创建时间排序
      ],
      take: limit
    })

    // 处理产品图片 URL
    const processedProducts = relatedProducts.map(product => processProductImages(product, context))

    const elapsed = Date.now() - startTime
    console.log(`✅ [related-products] 成功查询到 ${relatedProducts.length} 个相关商品，耗时: ${elapsed}ms`)

    return success(
      processedProducts,
      `成功获取 ${relatedProducts.length} 个相关商品`
    )
  } catch (err) {
    console.error('❌ [related-products] 查询相关商品失败:', err.message)
    console.error('❌ [related-products] 错误堆栈:', err.stack)
    return error(
      '获取相关商品失败',
      500,
      process.env.NODE_ENV === 'development' ? err.message : undefined
    )
  }
}

