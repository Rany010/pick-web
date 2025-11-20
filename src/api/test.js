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
 * 获取测试商品数据
 */
export const getTestProducts = async () => {
  try {
    const response = await api.get('/test-products')
    return response.data
  } catch (error) {
    console.error('获取测试商品失败:', error)
    throw error
  }
}

