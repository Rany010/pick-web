import axios from 'axios'

const API_BASE = '/.netlify/functions'

// 获取 token
const getToken = () => {
  return localStorage.getItem('admin_token')
}

// 创建带认证的请求配置
const authConfig = () => {
  const token = getToken()
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
}

/**
 * 管理员登录
 */
export const adminLogin = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE}/auth-login`, {
      username,
      password
    })
    return response.data
  } catch (error) {
    console.error('Login API error:', error)
    return {
      success: false,
      error: error.response?.data?.error || 'Network error'
    }
  }
}

/**
 * 验证 token
 */
export const verifyToken = async () => {
  try {
    const response = await axios.get(`${API_BASE}/auth-verify`, authConfig())
    return response.data
  } catch (error) {
    return { success: false }
  }
}

/**
 * 获取分类列表
 */
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE}/categories-list`)
    return response.data
  } catch (error) {
    console.error('Get categories error:', error)
    return { success: false, error: 'Failed to load categories' }
  }
}

/**
 * 获取商品列表（管理员）
 */
export const getProducts = async (filters = {}) => {
  try {
    const params = new URLSearchParams()
    if (filters.category) params.append('category', filters.category)
    if (filters.status) params.append('status', filters.status)
    if (filters.search) params.append('search', filters.search)
    if (filters.limit) params.append('limit', filters.limit)
    if (filters.offset) params.append('offset', filters.offset)

    const response = await axios.get(
      `${API_BASE}/admin-products-list?${params.toString()}`,
      authConfig()
    )
    return response.data
  } catch (error) {
    console.error('Get products error:', error)
    return { success: false, error: 'Failed to load products' }
  }
}

/**
 * 获取单个商品详情（管理员）
 */
export const getProductById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE}/admin-product-detail?id=${id}`,
      authConfig()
    )
    return response.data
  } catch (error) {
    console.error('Get product error:', error)
    return { success: false, error: 'Failed to load product' }
  }
}

/**
 * 创建商品
 */
export const createProduct = async (productData) => {
  try {
    const response = await axios.post(
      `${API_BASE}/admin-product-create`,
      productData,
      authConfig()
    )
    return response.data
  } catch (error) {
    console.error('Create product error:', error)
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to create product' 
    }
  }
}

/**
 * 更新商品
 */
export const updateProduct = async (id, productData) => {
  try {
    const response = await axios.put(
      `${API_BASE}/admin-product-update`,
      { id, ...productData },
      authConfig()
    )
    return response.data
  } catch (error) {
    console.error('Update product error:', error)
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to update product' 
    }
  }
}

/**
 * 删除商品
 */
export const deleteProductById = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE}/admin-product-delete?id=${id}`,
      authConfig()
    )
    return response.data
  } catch (error) {
    console.error('Delete product error:', error)
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to delete product' 
    }
  }
}

/**
 * 更新商品状态
 */
export const updateProductStatus = async (id, status) => {
  try {
    const response = await axios.patch(
      `${API_BASE}/admin-product-status`,
      { id, status },
      authConfig()
    )
    return response.data
  } catch (error) {
    console.error('Update product status error:', error)
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to update product status' 
    }
  }
}

