#!/usr/bin/env node

/**
 * 创建测试 Banner 数据
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createTestBanner() {
  console.log('🎯 创建测试 Banner...')

  try {
    // 先删除现有的测试 Banner
    await prisma.banner.deleteMany({
      where: {
        title: {
          startsWith: 'Test Banner'
        }
      }
    })

    // 创建新的测试 Banner
    const banner = await prisma.banner.create({
      data: {
        title: 'Test Banner - Premium Equipment',
        subtitle: 'Get the best gear for your game',
        imageUrl: 'https://picsum.photos/seed/banner1/600/400',
        linkUrl: '/products',
        buttonText: 'Shop Now',
        sortOrder: 1,
        isActive: true,
        startDate: null, // 立即生效
        endDate: null    // 永不过期
      }
    })

    console.log('✅ 测试 Banner 创建成功:', {
      id: banner.id,
      title: banner.title,
      isActive: banner.isActive
    })

    // 验证查询
    const allBanners = await prisma.banner.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        sortOrder: 'asc'
      }
    })

    console.log('📊 当前激活的 Banner 数量:', allBanners.length)
    allBanners.forEach((b, index) => {
      console.log(`  ${index + 1}. ${b.title} (ID: ${b.id})`)
    })

  } catch (error) {
    console.error('❌ 创建测试 Banner 失败:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// 运行脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  createTestBanner()
    .catch((error) => {
      console.error('❌ 脚本执行失败:', error)
      process.exit(1)
    })
}

export { createTestBanner }
