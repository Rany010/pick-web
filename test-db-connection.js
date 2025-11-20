import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔍 测试数据库连接...\n')
    
    // 测试连接
    await prisma.$connect()
    console.log('✅ 数据库连接成功！\n')
    
    // 查询测试商品
    const products = await prisma.testProduct.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    console.log(`📦 找到 ${products.length} 个测试商品：\n`)
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`)
      console.log(`   价格: $${product.price}`)
      console.log(`   描述: ${product.description}`)
      console.log(`   ID: ${product.id}`)
      console.log('')
    })
    
    console.log('✅ 数据库测试通过！\n')
    console.log('🎯 下一步：')
    console.log('   1. 部署到 Netlify: git push')
    console.log('   2. 在 Netlify 上测试完整流程')
    console.log('   3. 或使用 Netlify Dev 本地测试: npx netlify dev')
    
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()

