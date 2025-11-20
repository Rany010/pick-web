import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始填充测试数据...')

  // 清除现有测试数据
  await prisma.testProduct.deleteMany()
  console.log('✅ 清除旧数据完成')

  // 创建测试商品数据
  const testProducts = await prisma.testProduct.createMany({
    data: [
      {
        name: 'Carbon Fiber Pickleball Paddle',
        description: 'Professional grade carbon fiber paddle for advanced players',
        price: 89.99,
      },
      {
        name: 'Kids Pickleball Paddle Set',
        description: 'Lightweight paddle perfect for children aged 8-12',
        price: 39.99,
      },
      {
        name: 'Pickleball Net System',
        description: 'Portable net system for indoor and outdoor courts',
        price: 129.99,
      },
      {
        name: 'Premium Pickleball Balls (12-pack)',
        description: 'Tournament quality outdoor pickleballs',
        price: 24.99,
      },
      {
        name: 'Pickleball Paddle Bag',
        description: 'Durable bag with space for 4 paddles and accessories',
        price: 54.99,
      },
    ],
  })

  console.log(`✅ 创建了 5 个测试商品数据`)

  // 查询并显示创建的数据
  const products = await prisma.testProduct.findMany()
  console.log('\n📦 测试商品列表:')
  products.forEach((product) => {
    console.log(`  - ${product.name} ($${product.price})`)
  })

  console.log('\n🎉 数据填充完成！')
}

main()
  .catch((e) => {
    console.error('❌ 错误:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

