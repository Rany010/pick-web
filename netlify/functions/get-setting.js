import prisma from './utils/db'
import { success, error, options } from './utils/response'

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return options()
  }

  if (event.httpMethod !== 'GET') {
    return error('Method not allowed', 405)
  }

  const { key } = event.queryStringParameters

  if (!key) {
    return error('Missing key parameter')
  }

  try {
    const setting = await prisma.setting.findUnique({
      where: { key }
    })

    // 如果 value 存储的是 JSON 字符串，尝试解析它
    // 但通常设置可能就是字符串，或者调用者自己解析
    // 为了方便，我们原样返回，如果需要解析可以在前端做
    // 或者是，我们尝试解析，如果是合法的 JSON 对象则返回对象
    // 这里为了通用性，返回 raw string 比较好，或者前端自己处理。
    // 但是考虑到 Admin 页面保存时是 JSON.stringify 的，如果前端获取时能自动 parse 会方便些。
    // 这里简单处理：如果 type 是 'json'，尝试 parse
    
    let result = setting ? setting.value : null
    
    if (setting && setting.type === 'json' && setting.value) {
        try {
            result = JSON.parse(setting.value)
        } catch (e) {
            console.warn('Failed to parse JSON setting:', e)
        }
    }

    return success(result)
  } catch (err) {
    console.error('Get setting error:', err)
    return error('Internal server error', 500)
  }
}

