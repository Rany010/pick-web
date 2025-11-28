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
    console.log(`🔍 [get-setting] Fetching setting for key: ${key}`)
    
    let setting = null
    try {
        setting = await prisma.setting.findUnique({
            where: { key }
        })
        console.log(`✅ [get-setting] Found setting:`, setting ? 'yes' : 'no')
    } catch (dbError) {
        console.error(`❌ [get-setting] Database query failed:`, dbError)
        // Return 404 or empty success instead of 500 if table doesn't exist or query fails
        // This allows the frontend to fallback to defaults gracefully
        return success(null, 'Setting not found (DB error)') 
    }

    // 如果 value 存储的是 JSON 字符串，尝试解析它
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

