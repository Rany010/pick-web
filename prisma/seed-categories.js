import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始初始化分类数据...')

  // 检查是否已有分类
  const existingCategories = await prisma.category.count()
  if (existingCategories > 0) {
    console.log(`⚠️  已存在 ${existingCategories} 个分类，跳过初始化`)
    return
  }

  // 创建主分类
  const categories = [
    {
      nameEn: 'Paddles',
      slug: 'paddles',
      description: 'Pickleball paddles for all skill levels',
      icon: '🏓',
      sortOrder: 1,
      isActive: true
    },
    {
      nameEn: 'Balls',
      slug: 'balls',
      description: 'Indoor and outdoor pickleballs',
      icon: '⚾',
      sortOrder: 2,
      isActive: true
    },
    {
      nameEn: 'Nets & Courts',
      slug: 'nets-courts',
      description: 'Portable nets and court equipment',
      icon: '🥅',
      sortOrder: 3,
      isActive: true
    },
    {
      nameEn: 'Bags & Accessories',
      slug: 'bags-accessories',
      description: 'Paddle bags and accessories',
      icon: '🎒',
      sortOrder: 4,
      isActive: true
    },
    {
      nameEn: 'Apparel',
      slug: 'apparel',
      description: 'Pickleball clothing and shoes',
      icon: '👕',
      sortOrder: 5,
      isActive: true
    },
    {
      nameEn: 'Training Equipment',
      slug: 'training-equipment',
      description: 'Training aids and practice equipment',
      icon: '🎯',
      sortOrder: 6,
      isActive: true
    }
  ]

  for (const category of categories) {
    const created = await prisma.category.create({
      data: category
    })
    console.log(`✅ 创建分类: ${created.nameEn} (${created.slug})`)
  }

  console.log(`\n🎉 成功创建 ${categories.length} 个分类！`)
}

main()
  .catch((e) => {
    console.error('❌ 错误:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

