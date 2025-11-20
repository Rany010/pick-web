import { PrismaClient } from '@prisma/client'

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

