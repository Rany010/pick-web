import prismaModule from './utils/db.js'
import { success, error, options } from './utils/response.js'

const prisma = prismaModule.default || prismaModule

/**
 * 初始化数据库数据（仅用于开发/初始化）
 * POST /api/seed-data
 */
export const handler = async (event, context) => {
  // 处理 OPTIONS 请求
  if (event.httpMethod === 'OPTIONS') {
    return options()
  }

  // 只允许 POST 请求
  if (event.httpMethod !== 'POST') {
    return error('Method not allowed', 405)
  }

  try {
    console.log('🌱 开始初始化数据...')

    // 1. 创建分类
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

    // 2. 创建标签
    const tags = {
      professional: await prisma.tag.upsert({
        where: { slug: 'professional' },
        update: {},
        create: { nameEn: 'Professional', slug: 'professional' }
      }),
      beginnerFriendly: await prisma.tag.upsert({
        where: { slug: 'beginner-friendly' },
        update: {},
        create: { nameEn: 'Beginner Friendly', slug: 'beginner-friendly' }
      }),
      carbonFiber: await prisma.tag.upsert({
        where: { slug: 'carbon-fiber' },
        update: {},
        create: { nameEn: 'Carbon Fiber', slug: 'carbon-fiber' }
      }),
      lightweight: await prisma.tag.upsert({
        where: { slug: 'lightweight' },
        update: {},
        create: { nameEn: 'Lightweight', slug: 'lightweight' }
      }),
      usapaApproved: await prisma.tag.upsert({
        where: { slug: 'usapa-approved' },
        update: {},
        create: { nameEn: 'USAPA Approved', slug: 'usapa-approved' }
      })
    }

    // 3. 创建商品
    const products = []

    // 商品 1
    const product1 = await prisma.product.upsert({
      where: { slug: 'carbon-fiber-paddle' },
      update: {},
      create: {
        categoryId: paddlesCategory.id,
        nameEn: 'Carbon Fiber Pickleball Paddle',
        slug: 'carbon-fiber-paddle',
        description: 'Professional grade carbon fiber paddle for advanced players with superior control and power',
        features: ['High-quality carbon fiber construction', 'Lightweight design for quick maneuverability', 'Ergonomic grip for comfortable play', 'USAPA approved for tournament play', 'Includes protective cover'],
        specifications: { weight: '7.8 oz', gripSize: '4.25 inches', paddleFace: '16" x 8"', material: 'Carbon Fiber', coreType: 'Polymer Honeycomb' },
        price: 89.99,
        originalPrice: 109.99,
        stock: 25,
        rating: 4.8,
        reviewCount: 126,
        isFeatured: true,
        status: 'active'
      }
    })
    products.push(product1)

    // 其他商品...
    const product2 = await prisma.product.upsert({
      where: { slug: 'kids-paddle-set' },
      update: {},
      create: {
        categoryId: paddlesCategory.id,
        nameEn: 'Kids Pickleball Paddle Set',
        slug: 'kids-paddle-set',
        description: 'Lightweight paddle perfect for children aged 8-12, includes 2 paddles and 4 balls',
        features: ['Lightweight design for young players', 'Vibrant colors and fun graphics', 'Cushioned grip for small hands', 'Includes 2 paddles and 4 balls', 'Carry bag included'],
        specifications: { weight: '6.5 oz', gripSize: '3.75 inches', paddleFace: '15" x 7.5"', material: 'Composite', coreType: 'Polymer' },
        price: 39.99,
        originalPrice: 49.99,
        stock: 40,
        rating: 4.2,
        reviewCount: 89,
        isNew: true,
        status: 'active'
      }
    })
    products.push(product2)

    const product3 = await prisma.product.upsert({
      where: { slug: 'polymer-core-paddle' },
      update: {},
      create: {
        categoryId: paddlesCategory.id,
        nameEn: 'Professional Polymer Core Paddle',
        slug: 'polymer-core-paddle',
        description: 'Advanced polymer core technology provides exceptional control and reduced vibration',
        features: ['Advanced polymer honeycomb core', 'Graphite face for precision shots', 'Edge guard protection', 'USAPA approved', 'Premium cushioned grip'],
        specifications: { weight: '8.0 oz', gripSize: '4.5 inches', paddleFace: '16.5" x 7.5"', material: 'Graphite', coreType: 'Polymer Honeycomb' },
        price: 119.99,
        originalPrice: 149.99,
        stock: 15,
        rating: 4.9,
        reviewCount: 234,
        isFeatured: true,
        status: 'active'
      }
    })
    products.push(product3)

    const product4 = await prisma.product.upsert({
      where: { slug: 'net-system' },
      update: {},
      create: {
        categoryId: accessoriesCategory.id,
        nameEn: 'Pickleball Net System',
        slug: 'net-system',
        description: 'Portable net system for indoor and outdoor courts, easy setup and takedown',
        features: ['Tournament-grade steel frame', 'Weather-resistant net', 'Quick assembly system', 'Includes carry bag', 'Official regulation height (34" center)'],
        specifications: { width: '22 feet', height: '36" sides, 34" center', weight: '35 lbs', material: 'Steel frame, PE net', setup: '10 minutes' },
        price: 129.99,
        originalPrice: 159.99,
        stock: 12,
        rating: 4.6,
        reviewCount: 92,
        status: 'active'
      }
    })
    products.push(product4)

    const product5 = await prisma.product.upsert({
      where: { slug: 'premium-balls-12pack' },
      update: {},
      create: {
        categoryId: ballsCategory.id,
        nameEn: 'Premium Pickleball Balls (12-pack)',
        slug: 'premium-balls-12pack',
        description: 'Tournament quality outdoor pickleballs, USAPA approved, pack of 12',
        features: ['USAPA approved for tournament play', 'Consistent bounce and flight', 'Durable seamless construction', '40 precision-drilled holes', 'High visibility yellow color'],
        specifications: { quantity: '12 balls', diameter: '2.87 inches', weight: '0.88 oz', holes: '40 holes', type: 'Outdoor' },
        price: 24.99,
        stock: 80,
        rating: 4.7,
        reviewCount: 156,
        status: 'active'
      }
    })
    products.push(product5)

    const product6 = await prisma.product.upsert({
      where: { slug: 'paddle-bag' },
      update: {},
      create: {
        categoryId: accessoriesCategory.id,
        nameEn: 'Pickleball Paddle Bag',
        slug: 'paddle-bag',
        description: 'Durable bag with space for 4 paddles and accessories, multiple pockets',
        features: ['Holds up to 4 paddles', 'Multiple storage compartments', 'Adjustable shoulder strap', 'Water-resistant material', 'Ventilated shoe compartment'],
        specifications: { capacity: '4 paddles', dimensions: '18" x 12" x 8"', material: 'Polyester', weight: '1.2 lbs', pockets: '5 compartments' },
        price: 54.99,
        originalPrice: 69.99,
        stock: 30,
        rating: 4.5,
        reviewCount: 78,
        status: 'active'
      }
    })
    products.push(product6)

    // 4. 创建商品图片
    for (const product of products) {
      const existingImage = await prisma.productImage.findFirst({
        where: { productId: product.id }
      })
      
      if (!existingImage) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            imageUrl: `https://picsum.photos/seed/${product.slug}/600/400`,
            thumbnailUrl: `https://picsum.photos/seed/${product.slug}/200/150`,
            altText: product.nameEn,
            sortOrder: 1,
            isPrimary: true
          }
        })
      }
    }

    console.log('✅ 数据初始化完成')

    return success(
      {
        categories: 3,
        tags: 5,
        products: products.length
      },
      '数据初始化成功'
    )
  } catch (err) {
    console.error('❌ 初始化数据失败:', err)
    return error(
      '初始化数据失败',
      500,
      err.message
    )
  }
}

