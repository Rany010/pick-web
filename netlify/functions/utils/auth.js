import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

/**
 * 生成 JWT token
 */
export const generateToken = (adminId, username, role) => {
  return jwt.sign(
    {
      adminId,
      username,
      role,
      iat: Math.floor(Date.now() / 1000)
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
}

/**
 * 验证 JWT token
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

/**
 * 从请求头中提取 token
 */
export const extractToken = (event) => {
  const authHeader = event.headers.authorization || event.headers.Authorization
  
  if (!authHeader) {
    return null
  }

  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  return authHeader
}

/**
 * 验证管理员权限中间件
 */
export const requireAuth = (event) => {
  const token = extractToken(event)
  
  if (!token) {
    return {
      isAuthorized: false,
      error: 'No token provided'
    }
  }

  const decoded = verifyToken(token)
  
  if (!decoded) {
    return {
      isAuthorized: false,
      error: 'Invalid or expired token'
    }
  }

  return {
    isAuthorized: true,
    admin: decoded
  }
}

