import { PrismaClient } from '@prisma/client'

// 确保使用正确的数据库连接字符串
// Netlify Neon 扩展使用 NETLIFY_DATABASE_URL_UNPOOLED
const databaseUrl = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL_UNPOOLED

if (!databaseUrl) {
  console.error('❌ 未找到数据库连接字符串！请设置 DATABASE_URL 或 NETLIFY_DATABASE_URL_UNPOOLED')
}

// 创建 Prisma 客户端实例
// 在 Serverless 环境中，我们需要确保只创建一个实例
let prisma

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl
      }
    }
  })
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl
        }
      }
    })
  }
  prisma = global.prisma
}

export default prisma

