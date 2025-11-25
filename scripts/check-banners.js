#!/usr/bin/env node

/**
 * 检查 Banner 数据
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkBanners() {
  console.log('🔍 检查 Banner 数据...')

  try {
    // 查询所有 Banner
    const allBanners = await prisma.banner.findMany({
      orderBy: {
        id: 'asc'
      }
    })

    console.log('📊 所有 Banner 数据:')
    allBanners.forEach((banner) => {
      console.log(`  ID: ${banner.id}`)
      console.log(`  Title: ${banner.title}`)
      console.log(`  Subtitle: ${banner.subtitle || 'N/A'}`)
      console.log(`  IsActive: ${banner.isActive}`)
      console.log(`  StartDate: ${banner.startDate || 'N/A'}`)
      console.log(`  EndDate: ${banner.endDate || 'N/A'}`)
      console.log(`  ImageUrl: ${banner.imageUrl?.substring(0, 50)}...`)
      console.log(`  LinkUrl: ${banner.linkUrl || 'N/A'}`)
      console.log(`  ButtonText: ${banner.buttonText || 'N/A'}`)
      console.log(`  SortOrder: ${banner.sortOrder}`)
      console.log('  ---')
    })

    // 模拟前端查询（非管理员）
    const now = new Date()
    const publicBanners = await prisma.banner.findMany({
      where: {
        isActive: true,
        AND: [
          {
            OR: [
              { startDate: null },
              { startDate: { lte: now } }
            ]
          },
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } }
            ]
          }
        ]
      },
      orderBy: {
        sortOrder: 'asc'
      }
    })

    console.log('\n🌐 前端可见的 Banner 数据:')
    publicBanners.forEach((banner, index) => {
      console.log(`  ${index + 1}. ${banner.title} (ID: ${banner.id})`)
    })

    if (publicBanners.length === 0) {
      console.log('⚠️ 没有找到前端可见的 Banner！')
    }

  } catch (error) {
    console.error('❌ 检查 Banner 失败:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// 运行脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  checkBanners()
    .catch((error) => {
      console.error('❌ 脚本执行失败:', error)
      process.exit(1)
    })
}

export { checkBanners }
