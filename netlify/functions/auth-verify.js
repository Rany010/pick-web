import { success, error, options } from './utils/response.js'
import { requireAuth } from './utils/auth.js'

/**
 * 验证 token
 * GET /api/auth-verify
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

    return success(
      {
        admin: auth.admin
      },
      'Token is valid'
    )
  } catch (err) {
    console.error('❌ Token 验证失败:', err)
    return error('Token verification failed', 500)
  }
}

