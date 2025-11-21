import prismaModule from './utils/db.js'
import { success, error, options } from './utils/response.js'
import { generateToken } from './utils/auth.js'
import bcrypt from 'bcryptjs'

const prisma = prismaModule.default || prismaModule

/**
 * 管理员登录
 * POST /api/auth-login
 * Body: { username, password }
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
    const { username, password } = JSON.parse(event.body || '{}')

    // 验证输入
    if (!username || !password) {
      return error('Username and password are required', 400)
    }

    console.log(`🔐 管理员登录尝试 - 用户名: ${username}`)

    // 查找管理员
    const admin = await prisma.admin.findUnique({
      where: { username }
    })

    if (!admin) {
      console.log('❌ 管理员不存在')
      return error('Invalid username or password', 401)
    }

    // 检查账号是否启用
    if (!admin.isActive) {
      console.log('❌ 管理员账号已禁用')
      return error('Account is disabled', 403)
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash)

    if (!isPasswordValid) {
      console.log('❌ 密码错误')
      return error('Invalid username or password', 401)
    }

    // 更新最后登录时间
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() }
    })

    // 生成 token
    const token = generateToken(admin.id, admin.username, admin.role)

    console.log('✅ 登录成功')

    return success(
      {
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        }
      },
      'Login successful'
    )
  } catch (err) {
    console.error('❌ 登录失败:', err)
    return error(
      'Login failed',
      500,
      process.env.NODE_ENV === 'development' ? err.message : undefined
    )
  }
}

