/**
 * 清理孤儿 Blob 文件
 * 该脚本会扫描 Netlify Blobs 中的所有图片，
 * 并删除那些在数据库中没有引用的图片文件
 */

import { getStore } from '@netlify/blobs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupOrphanBlobs() {
  console.log('🔍 开始扫描孤儿 Blob 文件...\n')

  try {
    // 获取 Blobs store
    const store = getStore('images')
    
    // 列出所有 Blob 文件
    console.log('📦 获取所有 Blob 文件...')
    const { blobs } = await store.list()
    console.log(`找到 ${blobs.length} 个 Blob 文件\n`)

    if (blobs.length === 0) {
      console.log('✅ 没有找到任何 Blob 文件')
      return
    }

    // 收集数据库中所有引用的图片 URL
    console.log('🔍 收集数据库中引用的图片...')
    const referencedUrls = new Set()

    // 1. 从产品图片中收集
    const productImages = await prisma.productImage.findMany({
      select: { imageUrl: true, thumbnailUrl: true }
    })
    productImages.forEach(img => {
      if (img.imageUrl) referencedUrls.add(img.imageUrl)
      if (img.thumbnailUrl) referencedUrls.add(img.thumbnailUrl)
    })
    console.log(`  - 产品图片: ${productImages.length} 条记录`)

    // 2. 从轮播图中收集
    const banners = await prisma.banner.findMany({
      select: { imageUrl: true }
    })
    banners.forEach(banner => {
      if (banner.imageUrl) referencedUrls.add(banner.imageUrl)
    })
    console.log(`  - 轮播图: ${banners.length} 条记录`)

    // 3. 从设置中收集（可能包含 JSON 格式的图片 URL）
    const settings = await prisma.setting.findMany({
      where: { type: 'json' }
    })
    settings.forEach(setting => {
      try {
        const value = JSON.parse(setting.value)
        // 递归查找所有字符串值，检查是否为图片 URL
        const findImageUrls = (obj) => {
          if (typeof obj === 'string' && obj && !obj.startsWith('http') && !obj.startsWith('/') && !obj.startsWith('data:')) {
            referencedUrls.add(obj)
          } else if (typeof obj === 'object' && obj !== null) {
            Object.values(obj).forEach(findImageUrls)
          }
        }
        findImageUrls(value)
      } catch (e) {
        // 忽略 JSON 解析错误
      }
    })
    console.log(`  - 设置项: ${settings.length} 条记录`)

    console.log(`\n📊 数据库中引用了 ${referencedUrls.size} 个唯一的图片\n`)

    // 找出孤儿 Blob 文件
    const orphanBlobs = []
    for (const blob of blobs) {
      if (!referencedUrls.has(blob.key)) {
        orphanBlobs.push(blob)
      }
    }

    console.log(`🗑️  找到 ${orphanBlobs.length} 个孤儿 Blob 文件\n`)

    if (orphanBlobs.length === 0) {
      console.log('✅ 没有找到孤儿 Blob 文件，所有文件都有引用！')
      return
    }

    // 显示孤儿文件列表
    console.log('孤儿 Blob 文件列表:')
    orphanBlobs.forEach((blob, index) => {
      const sizeKB = (blob.size / 1024).toFixed(2)
      console.log(`  ${index + 1}. ${blob.key} (${sizeKB} KB)`)
    })

    // 计算总大小
    const totalSize = orphanBlobs.reduce((sum, blob) => sum + blob.size, 0)
    const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2)
    console.log(`\n📊 总计: ${orphanBlobs.length} 个文件, ${totalSizeMB} MB\n`)

    // 询问是否删除（在脚本执行时需要确认）
    const shouldDelete = process.argv.includes('--delete')

    if (!shouldDelete) {
      console.log('ℹ️  预览模式：使用 --delete 参数执行实际删除操作')
      console.log('   命令: node scripts/cleanup-orphan-blobs.js --delete')
      return
    }

    // 执行删除
    console.log('🗑️  开始删除孤儿 Blob 文件...\n')
    let successCount = 0
    let failCount = 0

    for (const blob of orphanBlobs) {
      try {
        await store.delete(blob.key)
        console.log(`  ✅ 已删除: ${blob.key}`)
        successCount++
      } catch (err) {
        console.error(`  ❌ 删除失败: ${blob.key} - ${err.message}`)
        failCount++
      }
    }

    console.log(`\n📊 删除完成:`)
    console.log(`   成功: ${successCount}`)
    console.log(`   失败: ${failCount}`)
    console.log(`   释放空间: ${totalSizeMB} MB`)

  } catch (err) {
    console.error('❌ 清理失败:', err)
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

// 执行清理
cleanupOrphanBlobs()
  .then(() => {
    console.log('\n✅ 清理流程完成')
    process.exit(0)
  })
  .catch((err) => {
    console.error('\n❌ 清理流程失败:', err)
    process.exit(1)
  })

