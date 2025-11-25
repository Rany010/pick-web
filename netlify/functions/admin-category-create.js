import prismaModule from './utils/db.js'
import { success, error, options } from './utils/response.js'
import { requireAuth } from './utils/auth.js'

const prisma = prismaModule.default || prismaModule

/**
 * 创建分类（管理员）
 * POST /api/admin-category-create
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
    if (!data.nameEn || !data.slug) {
      return error('Missing required fields: nameEn, slug', 400)
    }

    console.log(`📁 管理员创建分类 - 名称: ${data.nameEn}`)

    // 检查 slug 是否已存在
    const existingCategory = await prisma.category.findUnique({
      where: { slug: data.slug }
    })

    if (existingCategory) {
      return error('Category with this slug already exists', 400)
    }

    // 创建分类
    const category = await prisma.category.create({
      data: {
        nameEn: data.nameEn,
        slug: data.slug,
        description: data.description || null,
        icon: data.icon || null,
        parentId: data.parentId || null,
        sortOrder: data.sortOrder || 0,
        isActive: data.isActive !== undefined ? data.isActive : true
      }
    })

    console.log(`✅ 成功创建分类 ID: ${category.id}`)

    return success(category, '分类创建成功')
  } catch (err) {
    console.error('❌ 创建分类失败:', err)
    return error(
      '创建分类失败',
      500,
      process.env.NODE_ENV === 'development' ? err.message : undefined
    )
  }
}

