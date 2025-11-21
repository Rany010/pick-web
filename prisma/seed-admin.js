import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔐 开始创建管理员账号...')

  // 默认管理员账号信息
  const adminUsername = process.env.ADMIN_USERNAME || 'admin'
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@pickball.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456'

  // 检查管理员是否已存在
  const existingAdmin = await prisma.admin.findFirst({
    where: {
      OR: [
        { username: adminUsername },
        { email: adminEmail }
      ]
    }
  })

  if (existingAdmin) {
    console.log('⚠️  管理员账号已存在')
    console.log(`   用户名: ${existingAdmin.username}`)
    console.log(`   邮箱: ${existingAdmin.email}`)
    return
  }

  // 加密密码
  const passwordHash = await bcrypt.hash(adminPassword, 10)

  // 创建管理员账号
  const admin = await prisma.admin.create({
    data: {
      username: adminUsername,
      email: adminEmail,
      passwordHash: passwordHash,
      role: 'super_admin',
      isActive: true
    }
  })

  console.log('✅ 管理员账号创建成功！')
  console.log('=' .repeat(50))
  console.log('📋 登录信息：')
  console.log(`   用户名: ${admin.username}`)
  console.log(`   邮箱: ${admin.email}`)
  console.log(`   密码: ${adminPassword}`)
  console.log(`   角色: ${admin.role}`)
  console.log('=' .repeat(50))
  console.log('🔗 登录地址: http://localhost:8888/admin/login')
  console.log('')
  console.log('⚠️  请妥善保管登录信息，建议首次登录后修改密码！')
}

main()
  .catch((e) => {
    console.error('❌ 创建管理员账号失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

