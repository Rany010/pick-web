import prismaModule from './utils/db.js'
import { success, error, options } from './utils/response.js'
import { requireAuth } from './utils/auth.js'

const prisma = prismaModule.default || prismaModule

/**
 * 删除商品（管理员）
 * DELETE /api/admin-product-delete?id=1
 */
export const handler = async (event, context) => {
  // 处理 OPTIONS 请求（CORS 预检）
  if (event.httpMethod === 'OPTIONS') {
    return options()
  }

  // 只允许 DELETE 请求
  if (event.httpMethod !== 'DELETE') {
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

    console.log(`📦 管理员删除商品 - ID: ${productId}`)

    // 检查商品是否存在
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!existingProduct) {
      return error('Product not found', 404)
    }

    // 删除商品（级联删除会自动删除相关的图片和标签关联）
    await prisma.product.delete({
      where: { id: productId }
    })

    console.log(`✅ 成功删除商品: ${existingProduct.nameEn}`)

    return success(
      { id: productId },
      '商品删除成功'
    )
  } catch (err) {
    console.error('❌ 删除商品失败:', err)
    return error(
      '删除商品失败',
      500,
      process.env.NODE_ENV === 'development' ? err.message : undefined
    )
  }
}

