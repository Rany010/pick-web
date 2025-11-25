#!/usr/bin/env node

/**
 * 图片迁移脚本：将 base64 图片数据迁移到 Netlify Blobs
 * 
 * 使用方法：
 * 1. 确保已安装 @netlify/blobs 依赖
 * 2. 在 Netlify 环境中运行：node scripts/migrate-images-to-blobs.js
 * 3. 或在本地开发环境中运行（需要 netlify dev）
 */

import { PrismaClient } from '@prisma/client'
import { getStore } from '@netlify/blobs'

const prisma = new PrismaClient()

async function migrateImages() {
  console.log('🔄 开始迁移图片数据到 Netlify Blobs...')

  try {
    const store = getStore('product-images')

    // 1. 迁移 Banner 图片
    console.log('\n📋 迁移 Banner 图片...')
    const banners = await prisma.banner.findMany({
      where: {
        imageUrl: {
          startsWith: 'data:image'
        }
      }
    })

    console.log(`找到 ${banners.length} 个需要迁移的 Banner`)

    for (const banner of banners) {
      try {
        const { imageUrl } = banner
        
        // 解析 base64 数据
        const matches = imageUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
        if (!matches || matches.length !== 3) {
          console.warn(`⚠️ Banner ${banner.id} 的图片格式不正确，跳过`)
          continue
        }

        const mimeType = matches[1]
        const base64Data = matches[2]
        const buffer = Buffer.from(base64Data, 'base64')

        // 生成新的文件名
        const extension = mimeType.split('/')[1] || 'jpg'
        const fileName = `banner-${banner.id}-${Date.now()}.${extension}`

        // 上传到 Netlify Blobs
        await store.set(fileName, buffer, {
          metadata: {
            contentType: mimeType,
            originalId: banner.id.toString(),
            type: 'banner',
            migratedAt: new Date().toISOString()
          }
        })

        // 构造新的 URL
        const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || 'http://localhost:8888'
        const newImageUrl = `${siteUrl}/.netlify/functions/get-image?key=${fileName}`

        // 更新数据库
        await prisma.banner.update({
          where: { id: banner.id },
          data: { imageUrl: newImageUrl }
        })

        console.log(`✅ Banner ${banner.id} 迁移完成: ${fileName}`)

      } catch (error) {
        console.error(`❌ Banner ${banner.id} 迁移失败:`, error.message)
      }
    }

    // 2. 迁移产品图片
    console.log('\n🛍️ 迁移产品图片...')
    const productImages = await prisma.productImage.findMany({
      where: {
        imageUrl: {
          startsWith: 'data:image'
        }
      }
    })

    console.log(`找到 ${productImages.length} 个需要迁移的产品图片`)

    for (const productImage of productImages) {
      try {
        const { imageUrl } = productImage
        
        // 解析 base64 数据
        const matches = imageUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
        if (!matches || matches.length !== 3) {
          console.warn(`⚠️ 产品图片 ${productImage.id} 的格式不正确，跳过`)
          continue
        }

        const mimeType = matches[1]
        const base64Data = matches[2]
        const buffer = Buffer.from(base64Data, 'base64')

        // 生成新的文件名
        const extension = mimeType.split('/')[1] || 'jpg'
        const fileName = `product-${productImage.productId}-${productImage.id}-${Date.now()}.${extension}`

        // 上传到 Netlify Blobs
        await store.set(fileName, buffer, {
          metadata: {
            contentType: mimeType,
            originalId: productImage.id.toString(),
            productId: productImage.productId.toString(),
            type: 'product',
            migratedAt: new Date().toISOString()
          }
        })

        // 构造新的 URL
        const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || 'http://localhost:8888'
        const newImageUrl = `${siteUrl}/.netlify/functions/get-image?key=${fileName}`

        // 更新数据库
        await prisma.productImage.update({
          where: { id: productImage.id },
          data: { 
            imageUrl: newImageUrl,
            thumbnailUrl: newImageUrl // 缩略图也使用同一个 URL
          }
        })

        console.log(`✅ 产品图片 ${productImage.id} 迁移完成: ${fileName}`)

      } catch (error) {
        console.error(`❌ 产品图片 ${productImage.id} 迁移失败:`, error.message)
      }
    }

    console.log('\n🎉 图片迁移完成！')

    // 显示迁移统计
    const remainingBanners = await prisma.banner.count({
      where: { imageUrl: { startsWith: 'data:image' } }
    })
    
    const remainingProductImages = await prisma.productImage.count({
      where: { imageUrl: { startsWith: 'data:image' } }
    })

    console.log('\n📊 迁移统计:')
    console.log(`  - 剩余未迁移的 Banner 图片: ${remainingBanners}`)
    console.log(`  - 剩余未迁移的产品图片: ${remainingProductImages}`)

    if (remainingBanners === 0 && remainingProductImages === 0) {
      console.log('🎊 所有图片已成功迁移到 Netlify Blobs！')
    }

  } catch (error) {
    console.error('❌ 迁移过程中发生错误:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// 运行迁移
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateImages()
    .catch((error) => {
      console.error('❌ 迁移失败:', error)
      process.exit(1)
    })
}

export { migrateImages }
