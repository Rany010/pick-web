import prismaModule from './utils/db.js'
import { success, error, options } from './utils/response.js'
import { requireAuth } from './utils/auth.js'

const prisma = prismaModule.default || prismaModule

/**
 * 获取商品详情（管理员）
 * GET /api/admin-product-detail?id=1
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
    const productId = parseInt(params.id)

    if (!productId) {
      return error('Product ID is required', 400)
    }

    console.log(`📦 管理员查询商品详情 - ID: ${productId}`)

    // 查询商品
    const product = await prisma.product.findUnique({
      where: { id: productId },
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
      return error('Product not found', 404)
    }

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

