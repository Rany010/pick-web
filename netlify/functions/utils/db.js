import { PrismaClient } from '@prisma/client'

console.log('🔧 初始化 Prisma Client...')
console.log('🔧 NODE_ENV:', process.env.NODE_ENV)
console.log('🔧 DATABASE_URL 存在:', !!process.env.DATABASE_URL)
console.log('🔧 NETLIFY_DATABASE_URL_UNPOOLED 存在:', !!process.env.NETLIFY_DATABASE_URL_UNPOOLED)

// Netlify 环境中，优先使用 DATABASE_URL
// 如果没有，则尝试使用 Netlify Neon 扩展的环境变量
if (!process.env.DATABASE_URL && process.env.NETLIFY_DATABASE_URL_UNPOOLED) {
  console.log('🔧 使用 NETLIFY_DATABASE_URL_UNPOOLED')
  process.env.DATABASE_URL = process.env.NETLIFY_DATABASE_URL_UNPOOLED
}

// 创建 Prisma 客户端实例
// 在 Serverless 环境中，我们需要确保只创建一个实例
let prisma

try {
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient()
    console.log('✅ Prisma Client 已初始化（生产环境）')
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient()
      console.log('✅ Prisma Client 已初始化（开发环境）')
    }
    prisma = global.prisma
  }
} catch (err) {
  console.error('❌ Prisma Client 初始化失败:', err)
  throw err
}

export default prisma

