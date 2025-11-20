import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始填充商品数据...')

  // 1. 创建分类
  console.log('\n📁 创建分类...')
  
  const paddlesCategory = await prisma.category.upsert({
    where: { slug: 'paddles' },
    update: {},
    create: {
      nameEn: 'Paddles',
      slug: 'paddles',
      description: 'Professional pickleball paddles for all skill levels',
      sortOrder: 1,
      isActive: true
    }
  })

  const ballsCategory = await prisma.category.upsert({
    where: { slug: 'balls' },
    update: {},
    create: {
      nameEn: 'Balls',
      slug: 'balls',
      description: 'High-quality pickleball balls',
      sortOrder: 2,
      isActive: true
    }
  })

  const accessoriesCategory = await prisma.category.upsert({
    where: { slug: 'accessories' },
    update: {},
    create: {
      nameEn: 'Accessories',
      slug: 'accessories',
      description: 'Nets, bags, and other pickleball accessories',
      sortOrder: 3,
      isActive: true
    }
  })

  console.log('✅ 分类创建完成')

  // 2. 创建标签
  console.log('\n🏷️  创建标签...')
  
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'professional' },
      update: {},
      create: { nameEn: 'Professional', slug: 'professional' }
    }),
    prisma.tag.upsert({
      where: { slug: 'beginner-friendly' },
      update: {},
      create: { nameEn: 'Beginner Friendly', slug: 'beginner-friendly' }
    }),
    prisma.tag.upsert({
      where: { slug: 'carbon-fiber' },
      update: {},
      create: { nameEn: 'Carbon Fiber', slug: 'carbon-fiber' }
    }),
    prisma.tag.upsert({
      where: { slug: 'lightweight' },
      update: {},
      create: { nameEn: 'Lightweight', slug: 'lightweight' }
    }),
    prisma.tag.upsert({
      where: { slug: 'usapa-approved' },
      update: {},
      create: { nameEn: 'USAPA Approved', slug: 'usapa-approved' }
    })
  ])

  console.log('✅ 标签创建完成')

  // 3. 创建商品
  console.log('\n📦 创建商品...')

  // 商品 1: Carbon Fiber Paddle
  const product1 = await prisma.product.upsert({
    where: { slug: 'carbon-fiber-paddle' },
    update: {},
    create: {
      categoryId: paddlesCategory.id,
      nameEn: 'Carbon Fiber Pickleball Paddle',
      slug: 'carbon-fiber-paddle',
      description: 'Professional grade carbon fiber paddle for advanced players with superior control and power',
      features: [
        'High-quality carbon fiber construction',
        'Lightweight design for quick maneuverability',
        'Ergonomic grip for comfortable play',
        'USAPA approved for tournament play',
        'Includes protective cover'
      ],
      specifications: {
        weight: '7.8 oz',
        gripSize: '4.25 inches',
        paddleFace: '16" x 8"',
        material: 'Carbon Fiber',
        coreType: 'Polymer Honeycomb'
      },
      price: 89.99,
      originalPrice: 109.99,
      currency: 'USD',
      stock: 25,
      rating: 4.8,
      reviewCount: 126,
      isFeatured: true,
      isNew: false,
      status: 'active'
    }
  })

  await prisma.productImage.createMany({
    data: [
      {
        productId: product1.id,
        imageUrl: 'https://picsum.photos/seed/paddle1/600/400',
        thumbnailUrl: 'https://picsum.photos/seed/paddle1/200/150',
        altText: 'Carbon Fiber Paddle - Front View',
        sortOrder: 1,
        isPrimary: true
      },
      {
        productId: product1.id,
        imageUrl: 'https://picsum.photos/seed/paddle1a/600/400',
        thumbnailUrl: 'https://picsum.photos/seed/paddle1a/200/150',
        altText: 'Carbon Fiber Paddle - Side View',
        sortOrder: 2,
        isPrimary: false
      }
    ],
    skipDuplicates: true
  })

  await prisma.productTag.createMany({
    data: [
      { productId: product1.id, tagId: tags[0].id }, // Professional
      { productId: product1.id, tagId: tags[2].id }, // Carbon Fiber
      { productId: product1.id, tagId: tags[4].id }  // USAPA Approved
    ],
    skipDuplicates: true
  })

  // 商品 2: Kids Paddle Set
  const product2 = await prisma.product.upsert({
    where: { slug: 'kids-paddle-set' },
    update: {},
    create: {
      categoryId: paddlesCategory.id,
      nameEn: 'Kids Pickleball Paddle Set',
      slug: 'kids-paddle-set',
      description: 'Lightweight paddle perfect for children aged 8-12, includes 2 paddles and 4 balls',
      features: [
        'Lightweight design for young players',
        'Vibrant colors and fun graphics',
        'Cushioned grip for small hands',
        'Includes 2 paddles and 4 balls',
        'Carry bag included'
      ],
      specifications: {
        weight: '6.5 oz',
        gripSize: '3.75 inches',
        paddleFace: '15" x 7.5"',
        material: 'Composite',
        coreType: 'Polymer'
      },
      price: 39.99,
      originalPrice: 49.99,
      currency: 'USD',
      stock: 40,
      rating: 4.2,
      reviewCount: 89,
      isFeatured: false,
      isNew: true,
      status: 'active'
    }
  })

  await prisma.productImage.create({
    data: {
      productId: product2.id,
      imageUrl: 'https://picsum.photos/seed/paddle2/600/400',
      thumbnailUrl: 'https://picsum.photos/seed/paddle2/200/150',
      altText: 'Kids Paddle Set',
      sortOrder: 1,
      isPrimary: true
    }
  })

  await prisma.productTag.createMany({
    data: [
      { productId: product2.id, tagId: tags[1].id }, // Beginner Friendly
      { productId: product2.id, tagId: tags[3].id }  // Lightweight
    ],
    skipDuplicates: true
  })

  // 商品 3: Professional Polymer Core Paddle
  const product3 = await prisma.product.upsert({
    where: { slug: 'polymer-core-paddle' },
    update: {},
    create: {
      categoryId: paddlesCategory.id,
      nameEn: 'Professional Polymer Core Paddle',
      slug: 'polymer-core-paddle',
      description: 'Advanced polymer core technology provides exceptional control and reduced vibration',
      features: [
        'Advanced polymer honeycomb core',
        'Graphite face for precision shots',
        'Edge guard protection',
        'USAPA approved',
        'Premium cushioned grip'
      ],
      specifications: {
        weight: '8.0 oz',
        gripSize: '4.5 inches',
        paddleFace: '16.5" x 7.5"',
        material: 'Graphite',
        coreType: 'Polymer Honeycomb'
      },
      price: 119.99,
      originalPrice: 149.99,
      currency: 'USD',
      stock: 15,
      rating: 4.9,
      reviewCount: 234,
      isFeatured: true,
      isNew: false,
      status: 'active'
    }
  })

  await prisma.productImage.create({
    data: {
      productId: product3.id,
      imageUrl: 'https://picsum.photos/seed/paddle3/600/400',
      thumbnailUrl: 'https://picsum.photos/seed/paddle3/200/150',
      altText: 'Polymer Core Paddle',
      sortOrder: 1,
      isPrimary: true
    }
  })

  await prisma.productTag.createMany({
    data: [
      { productId: product3.id, tagId: tags[0].id }, // Professional
      { productId: product3.id, tagId: tags[4].id }  // USAPA Approved
    ],
    skipDuplicates: true
  })

  // 商品 4: Net System
  const product4 = await prisma.product.upsert({
    where: { slug: 'net-system' },
    update: {},
    create: {
      categoryId: accessoriesCategory.id,
      nameEn: 'Pickleball Net System',
      slug: 'net-system',
      description: 'Portable net system for indoor and outdoor courts, easy setup and takedown',
      features: [
        'Tournament-grade steel frame',
        'Weather-resistant net',
        'Quick assembly system',
        'Includes carry bag',
        'Official regulation height (34" center)'
      ],
      specifications: {
        width: '22 feet',
        height: '36" sides, 34" center',
        weight: '35 lbs',
        material: 'Steel frame, PE net',
        setup: '10 minutes'
      },
      price: 129.99,
      originalPrice: 159.99,
      currency: 'USD',
      stock: 12,
      rating: 4.6,
      reviewCount: 92,
      isFeatured: false,
      isNew: false,
      status: 'active'
    }
  })

  await prisma.productImage.create({
    data: {
      productId: product4.id,
      imageUrl: 'https://picsum.photos/seed/net1/600/400',
      thumbnailUrl: 'https://picsum.photos/seed/net1/200/150',
      altText: 'Pickleball Net System',
      sortOrder: 1,
      isPrimary: true
    }
  })

  // 商品 5: Premium Balls
  const product5 = await prisma.product.upsert({
    where: { slug: 'premium-balls-12pack' },
    update: {},
    create: {
      categoryId: ballsCategory.id,
      nameEn: 'Premium Pickleball Balls (12-pack)',
      slug: 'premium-balls-12pack',
      description: 'Tournament quality outdoor pickleballs, USAPA approved, pack of 12',
      features: [
        'USAPA approved for tournament play',
        'Consistent bounce and flight',
        'Durable seamless construction',
        '40 precision-drilled holes',
        'High visibility yellow color'
      ],
      specifications: {
        quantity: '12 balls',
        diameter: '2.87 inches',
        weight: '0.88 oz',
        holes: '40 holes',
        type: 'Outdoor'
      },
      price: 24.99,
      originalPrice: null,
      currency: 'USD',
      stock: 80,
      rating: 4.7,
      reviewCount: 156,
      isFeatured: false,
      isNew: false,
      status: 'active'
    }
  })

  await prisma.productImage.create({
    data: {
      productId: product5.id,
      imageUrl: 'https://picsum.photos/seed/balls1/600/400',
      thumbnailUrl: 'https://picsum.photos/seed/balls1/200/150',
      altText: 'Premium Pickleball Balls',
      sortOrder: 1,
      isPrimary: true
    }
  })

  await prisma.productTag.createMany({
    data: [
      { productId: product5.id, tagId: tags[4].id }  // USAPA Approved
    ],
    skipDuplicates: true
  })

  // 商品 6: Paddle Bag
  const product6 = await prisma.product.upsert({
    where: { slug: 'paddle-bag' },
    update: {},
    create: {
      categoryId: accessoriesCategory.id,
      nameEn: 'Pickleball Paddle Bag',
      slug: 'paddle-bag',
      description: 'Durable bag with space for 4 paddles and accessories, multiple pockets',
      features: [
        'Holds up to 4 paddles',
        'Multiple storage compartments',
        'Adjustable shoulder strap',
        'Water-resistant material',
        'Ventilated shoe compartment'
      ],
      specifications: {
        capacity: '4 paddles',
        dimensions: '18" x 12" x 8"',
        material: 'Polyester',
        weight: '1.2 lbs',
        pockets: '5 compartments'
      },
      price: 54.99,
      originalPrice: 69.99,
      currency: 'USD',
      stock: 30,
      rating: 4.5,
      reviewCount: 78,
      isFeatured: false,
      isNew: false,
      status: 'active'
    }
  })

  await prisma.productImage.create({
    data: {
      productId: product6.id,
      imageUrl: 'https://picsum.photos/seed/bag1/600/400',
      thumbnailUrl: 'https://picsum.photos/seed/bag1/200/150',
      altText: 'Paddle Bag',
      sortOrder: 1,
      isPrimary: true
    }
  })

  console.log('✅ 商品创建完成')

  // 查询并显示创建的数据
  const allProducts = await prisma.product.findMany({
    include: {
      category: true,
      images: true,
      tags: {
        include: { tag: true }
      }
    }
  })

  console.log(`\n📦 商品列表 (共 ${allProducts.length} 个):`)
  allProducts.forEach((product, index) => {
    console.log(`  ${index + 1}. ${product.nameEn} - $${product.price} (${product.category.nameEn})`)
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

