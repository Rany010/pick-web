#!/bin/bash
# 快速设置环境变量脚本

echo "🔧 设置本地开发环境"
echo ""
echo "请按照以下步骤操作："
echo ""
echo "1. 访问 Netlify 控制台"
echo "   https://app.netlify.com"
echo ""
echo "2. 进入您的站点 > Site configuration > Environment variables"
echo ""
echo "3. 找到并复制 NETLIFY_DATABASE_URL_UNPOOLED 的值"
echo ""
echo "4. 粘贴数据库连接字符串："
read -p "> " DATABASE_URL
echo ""

# 创建 .env 文件
cat > .env << EOF
# 数据库连接字符串
DATABASE_URL="${DATABASE_URL}"

# JWT 密钥（可以随机生成）
JWT_SECRET="$(openssl rand -base64 32 2>/dev/null || echo 'your-secret-key-change-this')"

# Node 环境
NODE_ENV="development"
EOF

echo "✅ .env 文件已创建！"
echo ""
echo "下一步，运行以下命令初始化数据库："
echo "  npm run db:generate"
echo "  npm run db:push"
echo "  npm run db:seed"
echo ""

