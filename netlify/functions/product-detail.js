import prismaModule from './utils/db.js'
import { success, error, options } from './utils/response.js'

const prisma = prismaModule.default || prismaModule

/**
 * 获取商品详情
 * GET /api/product-detail?id=1
 * GET /api/product-detail?slug=carbon-fiber-paddle
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
    const id = params.id ? parseInt(params.id) : null
    const slug = params.slug

    if (!id && !slug) {
      return error('请提供商品 ID 或 slug', 400)
    }

    console.log(`📦 查询商品详情 - ID: ${id}, slug: ${slug}`)

    // 构建查询条件
    const where = id ? { id } : { slug }

    // 查询商品
    const product = await prisma.product.findFirst({
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
      }
    })

    if (!product) {
      return error('商品不存在', 404)
    }

    // 增加浏览次数
    await prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } }
    })

    console.log(`✅ 成功查询商品: ${product.nameEn}`)

    return success(product, '成功获取商品详情')
  } catch (err) {
    console.error('❌ 查询商品详情失败:', err)
    return error(
      '获取商品详情失败',
      500,
      process.env.NODE_ENV === 'development' ? err.message : undefined
    )
  }
}

