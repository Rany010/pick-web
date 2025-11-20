import { PrismaClient } from '@prisma/client'

// Netlify 环境中，优先使用 DATABASE_URL
// 如果没有，则尝试使用 Netlify Neon 扩展的环境变量
if (!process.env.DATABASE_URL && process.env.NETLIFY_DATABASE_URL_UNPOOLED) {
  process.env.DATABASE_URL = process.env.NETLIFY_DATABASE_URL_UNPOOLED
}

// 创建 Prisma 客户端实例
// 在 Serverless 环境中，我们需要确保只创建一个实例
let prisma

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export default prisma

