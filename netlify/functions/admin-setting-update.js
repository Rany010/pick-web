import prisma from './utils/db'
import { success, error, options } from './utils/response'
import { requireAuth } from './utils/auth'

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return options()
  }

  if (event.httpMethod !== 'POST' && event.httpMethod !== 'PUT') {
    return error('Method not allowed', 405)
  }

  // 验证管理员权限
  const auth = requireAuth(event)
  if (!auth.isAuthorized) {
    return error(auth.error, 401)
  }

  try {
    const data = JSON.parse(event.body)
    const { key, value, description, type } = data

    if (!key || value === undefined) {
      return error('Missing required fields: key, value')
    }

    // 如果 type 是 json，且 value 是对象，则 stringify
    let valueToStore = value
    if (type === 'json' && typeof value === 'object') {
        valueToStore = JSON.stringify(value)
    } else if (typeof value !== 'string') {
        valueToStore = String(value)
    }

    const setting = await prisma.setting.upsert({
      where: { key },
      update: {
        value: valueToStore,
        description,
        type: type || 'string',
        updatedAt: new Date()
      },
      create: {
        key,
        value: valueToStore,
        description,
        type: type || 'string'
      }
    })

    return success(setting)
  } catch (err) {
    console.error('Update setting error:', err)
    return error('Internal server error', 500, err.message)
  }
}

