import prisma from './utils/db.js'
import { success, error, options } from './utils/response.js'

/**
 * 获取测试商品数据
 * GET /api/test-products
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
    console.log('📦 开始查询测试商品数据...')

    // 从数据库查询测试商品
    const products = await prisma.testProduct.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log(`✅ 成功查询到 ${products.length} 个商品`)

    return success(products, `成功获取 ${products.length} 个商品数据`)
  } catch (err) {
    console.error('❌ 查询测试商品失败:', err)
    
    // 返回更详细的错误信息
    return error(
      '获取商品数据失败',
      500,
      process.env.NODE_ENV === 'development' ? err.message : undefined
    )
  }
}

