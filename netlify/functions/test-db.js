import prisma from './utils/db.js'
import { success, error, options } from './utils/response.js'

/**
 * 测试数据库连接和 settings 表
 */
export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return options()
  }

  const results = {
    timestamp: new Date().toISOString(),
    tests: {}
  }

  // 测试 1: Prisma 客户端是否存在
  try {
    results.tests.prismaClient = {
      exists: !!prisma,
      type: typeof prisma
    }
  } catch (e) {
    results.tests.prismaClient = { error: e.message }
  }

  // 测试 2: 数据库连接
  try {
    await prisma.$connect()
    results.tests.dbConnection = { success: true }
  } catch (e) {
    results.tests.dbConnection = { success: false, error: e.message }
  }

  // 测试 3: settings 表是否存在
  try {
    const count = await prisma.setting.count()
    results.tests.settingsTable = { exists: true, count }
  } catch (e) {
    results.tests.settingsTable = { exists: false, error: e.message, code: e.code }
  }

  // 测试 4: 尝试创建/更新一个测试设置
  try {
    const testSetting = await prisma.setting.upsert({
      where: { key: '_test_connection' },
      update: {
        value: JSON.stringify({ test: true, timestamp: Date.now() }),
        type: 'json'
      },
      create: {
        key: '_test_connection',
        value: JSON.stringify({ test: true, timestamp: Date.now() }),
        type: 'json',
        description: 'Test setting for debugging'
      }
    })
    results.tests.upsertTest = { success: true, id: testSetting.id }
    
    // 清理测试数据
    await prisma.setting.delete({ where: { key: '_test_connection' } })
    results.tests.upsertTest.cleaned = true
  } catch (e) {
    results.tests.upsertTest = { success: false, error: e.message, code: e.code }
  }

  // 测试 5: 检查环境变量
  results.tests.envVars = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV
  }

  return success(results)
}

