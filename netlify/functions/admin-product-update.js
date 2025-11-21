import prismaModule from './utils/db.js'
import { success, error, options } from './utils/response.js'
import { requireAuth } from './utils/auth.js'

const prisma = prismaModule.default || prismaModule

/**
 * 更新商品（管理员）
 * PUT /api/admin-product-update
 */
export const handler = async (event, context) => {
  // 处理 OPTIONS 请求（CORS 预检）
  if (event.httpMethod === 'OPTIONS') {
    return options()
  }

  // 只允许 PUT 请求
  if (event.httpMethod !== 'PUT') {
    return error('Method not allowed', 405)
  }

  try {
    // 验证权限
    const auth = requireAuth(event)
    if (!auth.isAuthorized) {
      return error(auth.error, 401)
    }

    const data = JSON.parse(event.body || '{}')
    const productId = data.id

    if (!productId) {
      return error('Product ID is required', 400)
    }

    console.log(`📦 管理员更新商品 - ID: ${productId}`)

    // 检查商品是否存在
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!existingProduct) {
      return error('Product not found', 404)
    }

    // 如果更新 slug，检查是否与其他商品冲突
    if (data.slug && data.slug !== existingProduct.slug) {
      const slugConflict = await prisma.product.findFirst({
        where: {
          slug: data.slug,
          id: { not: productId }
        }
      })

      if (slugConflict) {
        return error('Product with this slug already exists', 400)
      }
    }

    // 更新商品
    const updateData = {}
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId
    if (data.nameEn !== undefined) updateData.nameEn = data.nameEn
    if (data.slug !== undefined) updateData.slug = data.slug
    if (data.description !== undefined) updateData.description = data.description
    if (data.features !== undefined) updateData.features = data.features
    if (data.specifications !== undefined) updateData.specifications = data.specifications
    if (data.price !== undefined) updateData.price = data.price
    if (data.originalPrice !== undefined) updateData.originalPrice = data.originalPrice
    if (data.currency !== undefined) updateData.currency = data.currency
    if (data.stock !== undefined) updateData.stock = data.stock
    if (data.rating !== undefined) updateData.rating = data.rating
    if (data.reviewCount !== undefined) updateData.reviewCount = data.reviewCount
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured
    if (data.isNew !== undefined) updateData.isNew = data.isNew
    if (data.status !== undefined) updateData.status = data.status

    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData,
      include: {
        category: true,
        images: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    console.log(`✅ 成功更新商品: ${product.nameEn}`)

    return success(product, '商品更新成功')
  } catch (err) {
    console.error('❌ 更新商品失败:', err)
    return error(
      '更新商品失败',
      500,
      process.env.NODE_ENV === 'development' ? err.message : undefined
    )
  }
}

