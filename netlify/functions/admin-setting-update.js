import prisma from './utils/db'
import { success, error, options } from './utils/response'
import { requireAuth } from './utils/auth'
import { deleteBlob } from './utils/image.js'

export const handler = async (event, context) => {
  // 添加请求日志
  console.log(`📝 [admin-setting-update] Method: ${event.httpMethod}`)

  if (event.httpMethod === 'OPTIONS') {
    return options()
  }

  if (event.httpMethod !== 'POST' && event.httpMethod !== 'PUT') {
    return error('Method not allowed', 405)
  }

  // 验证管理员权限
  const auth = requireAuth(event)
  if (!auth.isAuthorized) {
    console.warn(`⚠️ [admin-setting-update] Unauthorized access attempt: ${auth.error}`)
    return error(auth.error, 401)
  }

  try {
    console.log(`📝 [admin-setting-update] Parsing body...`)
    const data = JSON.parse(event.body)
    const { key, value, description, type } = data
    
    console.log(`📝 [admin-setting-update] Updating key: ${key}, Type: ${type}`)

    if (!key || value === undefined) {
      return error('Missing required fields: key, value')
    }

    // 获取现有设置（用于检查是否需要删除旧图片）
    const existingSetting = await prisma.setting.findUnique({
      where: { key }
    })

    // 如果是关于我们设置，检查是否需要删除旧图片
    if (key === 'about_us' && existingSetting && type === 'json' && typeof value === 'object') {
      try {
        const oldValue = JSON.parse(existingSetting.value)
        const newImageUrl = value.imageUrl
        const oldImageUrl = oldValue.imageUrl

        // 如果图片 URL 发生变化，删除旧图片 Blob
        if (oldImageUrl && newImageUrl && oldImageUrl !== newImageUrl) {
          console.log(`🗑️ 删除关于我们页面的旧图片`)
          const deleted = await deleteBlob(oldImageUrl)
          if (deleted) {
            console.log(`✅ 已删除旧图片 Blob`)
          }
        }
      } catch (e) {
        // 如果解析失败，忽略（可能是首次创建）
        console.log(`⚠️ 无法解析现有设置值，跳过图片删除检查`)
      }
    }

    // 如果 type 是 json，且 value 是对象，则 stringify
    let valueToStore = value
    if (type === 'json' && typeof value === 'object') {
        valueToStore = JSON.stringify(value)
    } else if (typeof value !== 'string') {
        valueToStore = String(value)
    }

    console.log(`📝 [admin-setting-update] Value to store (first 50 chars): ${valueToStore.substring(0, 50)}...`)

    const setting = await prisma.setting.upsert({
      where: { key },
      update: {
        value: valueToStore,
        description: description || null,
        type: type || 'string'
        // updatedAt 由 Prisma @updatedAt 自动处理
      },
      create: {
        key,
        value: valueToStore,
        description: description || null,
        type: type || 'string'
      }
    })

    console.log(`✅ [admin-setting-update] Successfully updated setting: ${key}`)
    return success(setting)
  } catch (err) {
    console.error('❌ [admin-setting-update] Error:', err)
    console.error('❌ [admin-setting-update] Error message:', err.message)
    console.error('❌ [admin-setting-update] Error code:', err.code)
    console.error('❌ [admin-setting-update] Error stack:', err.stack)
    
    // 检查是否是 Prisma 的 "Table does not exist" 错误
    // Postgres error code for undefined_table is 42P01, but Prisma might wrap it
    if (err.message && err.message.includes('does not exist')) {
         return error('Database table not found. Please run migrations.', 500, err.message)
    }
    
    // Prisma specific errors
    if (err.code === 'P2002') {
      return error('Unique constraint violation', 400, err.message)
    }
    if (err.code === 'P2025') {
      return error('Record not found', 404, err.message)
    }

    return error('Internal server error: ' + (err.message || 'Unknown error'), 500)
  }
}
