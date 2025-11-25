import prismaModule from './utils/db.js'
import { success, error, options } from './utils/response.js'
import { requireAuth } from './utils/auth.js'

const prisma = prismaModule.default || prismaModule

/**
 * 创建商品（管理员）
 * POST /api/admin-product-create
 */
export const handler = async (event, context) => {
  // 处理 OPTIONS 请求（CORS 预检）
  if (event.httpMethod === 'OPTIONS') {
    return options()
  }

  // 只允许 POST 请求
  if (event.httpMethod !== 'POST') {
    return error('Method not allowed', 405)
  }

  try {
    // 验证权限
    const auth = requireAuth(event)
    if (!auth.isAuthorized) {
      return error(auth.error, 401)
    }

    const data = JSON.parse(event.body || '{}')

    // 验证必填字段
    if (!data.categoryId || !data.nameEn || !data.slug || !data.price) {
      return error('Missing required fields: categoryId, nameEn, slug, price', 400)
    }

    console.log(`📦 管理员创建商品 - 名称: ${data.nameEn}`)

    // 检查 slug 是否已存在
    const existingProduct = await prisma.product.findUnique({
      where: { slug: data.slug }
    })

    if (existingProduct) {
      return error('Product with this slug already exists', 400)
    }

    // 创建商品
    const product = await prisma.product.create({
      data: {
        categoryId: data.categoryId,
        nameEn: data.nameEn,
        slug: data.slug,
        description: data.description || null,
        features: data.features || null,
        specifications: data.specifications || null,
        price: data.price,
        originalPrice: data.originalPrice || null,
        currency: data.currency || 'USD',
        stock: data.stock || 0,
        rating: data.rating || 0,
        reviewCount: data.reviewCount || 0,
        isFeatured: data.isFeatured || false,
        isNew: data.isNew || false,
        status: data.status || 'draft'
      },
      include: {
        category: true
      }
    })

    // 如果有图片，创建图片记录
    if (data.images && Array.isArray(data.images)) {
      await Promise.all(
        data.images.map((img, index) =>
          prisma.productImage.create({
            data: {
              productId: product.id,
              imageUrl: img.imageUrl,
              thumbnailUrl: img.thumbnailUrl || null,
              altText: img.altText || product.nameEn,
              sortOrder: index,
              isPrimary: index === 0
            }
          })
        )
      )
    }

    // 如果有标签，创建标签关联
    if (data.tagIds && Array.isArray(data.tagIds)) {
      await Promise.all(
        data.tagIds.map((tagId) =>
          prisma.productTag.create({
            data: {
              productId: product.id,
              tagId: tagId
            }
          })
        )
      )
    }

    console.log(`✅ 成功创建商品 ID: ${product.id}`)

    return success(product, '商品创建成功')
  } catch (err) {
    console.error('❌ 创建商品失败:', err)
    if (err.code) console.error('Error Code:', err.code)
    if (err.meta) console.error('Error Meta:', err.meta)

    return error(
      '创建商品失败',
      500,
      process.env.NODE_ENV === 'development' ? err.message : undefined
    )
  }
}

