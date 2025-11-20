import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const message = error.response?.data?.error || error.message || '请求失败'
    return Promise.reject(new Error(message))
  }
)

/**
 * 获取商品列表
 * @param {string} category - 分类 slug (all, paddles, balls, accessories)
 * @param {number} limit - 限制数量
 * @param {number} offset - 偏移量
 */
export const getProductsList = async (category = 'all', limit = 100, offset = 0) => {
  try {
    const response = await api.get('/products-list', {
      params: { category, limit, offset }
    })
    return response.data
  } catch (error) {
    console.error('获取商品列表失败:', error)
    throw error
  }
}

/**
 * 获取商品详情
 * @param {number|string} idOrSlug - 商品 ID 或 slug
 */
export const getProductDetail = async (idOrSlug) => {
  try {
    const params = typeof idOrSlug === 'number' 
      ? { id: idOrSlug } 
      : { slug: idOrSlug }
    
    const response = await api.get('/product-detail', { params })
    return response.data
  } catch (error) {
    console.error('获取商品详情失败:', error)
    throw error
  }
}

/**
 * 获取分类列表
 */
export const getCategoriesList = async () => {
  try {
    const response = await api.get('/categories-list')
    return response.data
  } catch (error) {
    console.error('获取分类列表失败:', error)
    throw error
  }
}

/**
 * 初始化数据（仅用于首次部署）
 */
export const seedData = async () => {
  try {
    const response = await api.post('/seed-data')
    return response.data
  } catch (error) {
    console.error('初始化数据失败:', error)
    throw error
  }
}

