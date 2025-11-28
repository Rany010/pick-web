import { PrismaClient } from '@prisma/client'

console.log('🔧 初始化 Prisma Client...')
console.log('🔧 NODE_ENV:', process.env.NODE_ENV)
console.log('🔧 DATABASE_URL 存在:', !!process.env.DATABASE_URL)

// Netlify 环境中，优先使用 DATABASE_URL
// 如果没有，则尝试使用 Netlify Neon 扩展的环境变量
if (!process.env.DATABASE_URL && process.env.NETLIFY_DATABASE_URL_UNPOOLED) {
  console.log('🔧 使用 NETLIFY_DATABASE_URL_UNPOOLED')
  process.env.DATABASE_URL = process.env.NETLIFY_DATABASE_URL_UNPOOLED
}

// 使用全局变量缓存 Prisma Client 实例
// 这在 Serverless 环境中很重要，可以复用连接
const globalForPrisma = globalThis

if (!globalForPrisma.prisma) {
  console.log('🔧 创建新的 Prisma Client 实例...')
  globalForPrisma.prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
  console.log('✅ Prisma Client 已初始化')
}

const prisma = globalForPrisma.prisma

export default prisma

