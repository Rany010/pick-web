import axios from 'axios'

const API_BASE = '/.netlify/functions'

export const getProductsList = async (category = 'all', limit = 10, offset = 0) => {
  try {
    const response = await axios.get(`${API_BASE}/products-list`, {
      params: {
        category,
        limit,
        offset
      }
    })
    return response.data.data
  } catch (error) {
    console.error('Failed to fetch products:', error)
    throw error
  }
}

export const getProductDetail = async (slugOrId) => {
  try {
    const response = await axios.get(`${API_BASE}/product-detail`, {
      params: {
        id: slugOrId
      }
    })
    return response.data.data
  } catch (error) {
    console.error('Failed to fetch product detail:', error)
    throw error
  }
}

export const getCategoriesList = async () => {
  try {
    const response = await axios.get(`${API_BASE}/categories-list`)
    return response.data.data
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    throw error
  }
}

/**
 * 获取 Banner 列表 (无需认证)
 */
export const getBanners = async () => {
  try {
    const response = await axios.get(`${API_BASE}/banners-list`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch banners:', error)
    return { success: false, data: [] }
  }
}
