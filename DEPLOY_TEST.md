# 🚀 部署测试指南

## ✅ 已完成步骤

### 1. 环境配置 ✓
- [x] Netlify 账号创建
- [x] Neon PostgreSQL 数据库集成
- [x] 环境变量配置完成
- [x] GitHub 仓库关联

### 2. 数据库初始化 ✓
- [x] Prisma Client 生成
- [x] 数据库 Schema 推送
- [x] 测试数据填充（5 个商品）
- [x] 数据库连接测试通过

### 3. 代码准备 ✓
- [x] 前端页面 (TestPage.vue)
- [x] API 接口 (test-products.js)
- [x] 数据库工具 (db.js, response.js)
- [x] Prisma Schema 定义

## 🧪 测试流程

### 方式一：在线测试（推荐）

由于您的项目已经关联 GitHub 和 Netlify：

1. **访问 Netlify Dashboard**
   ```
   https://app.netlify.com
   ```

2. **检查部署状态**
   - 进入您的 pick-web 站点
   - 查看 "Deploys" 标签
   - 确认最新部署状态为 "Published"

3. **测试应用**
   - 点击站点 URL（类似：`https://your-site-name.netlify.app`）
   - 应该看到 "🏓 Pick-Web Test Page"
   - 点击 "📦 获取商品数据" 按钮
   - 验证是否显示 5 个测试商品

### 方式二：本地测试

如果需要在本地测试完整流程：

1. **确保已链接 Netlify 项目**
   ```bash
   npx netlify link
   ```
   选择 "Use current git remote origin"

2. **启动 Netlify Dev**
   ```bash
   npx netlify dev
   ```
   这会：
   - 自动启动前端开发服务器
   - 启动 Netlify Functions
   - 配置正确的 API 路由代理

3. **访问本地站点**
   ```
   http://localhost:8888
   ```

## 📋 验收标准

第一阶段完成需满足：

- [ ] Netlify 部署成功，无错误
- [ ] 数据库连接正常
- [ ] 访问在线站点能看到测试页面
- [ ] 点击按钮成功获取并显示 5 个商品数据
- [ ] 完整流程验证：前端 → Netlify Functions → PostgreSQL → 前端展示

## 🔍 数据库数据验证

测试数据应包含以下 5 个商品：

1. **Carbon Fiber Pickleball Paddle** - $89.99
2. **Kids Pickleball Paddle Set** - $39.99
3. **Pickleball Net System** - $129.99
4. **Premium Pickleball Balls (12-pack)** - $24.99
5. **Pickleball Paddle Bag** - $54.99

## 🐛 故障排查

### 问题 1：Netlify Functions 404 错误

**原因**：Functions 可能未正确部署

**解决方案**：
1. 检查 `netlify.toml` 配置
2. 确认 `netlify/functions` 目录存在
3. 在 Netlify Dashboard 查看 Functions 日志
4. 触发重新部署

### 问题 2：数据库连接失败

**原因**：环境变量未设置

**解决方案**：
1. 在 Netlify Dashboard：Site configuration > Environment variables
2. 确认 `NETLIFY_DATABASE_URL` 存在
3. Neon 扩展应该自动设置这些变量

### 问题 3：CORS 错误

**原因**：API 响应头未正确设置

**解决方案**：
- 检查 `netlify/functions/utils/response.js` 中的 CORS 头
- 已配置 `Access-Control-Allow-Origin: *`

## 📊 监控和调试

### 查看 Netlify Functions 日志

1. Netlify Dashboard > 您的站点
2. 点击 "Functions" 标签
3. 选择 `test-products` 函数
4. 查看实时日志

### 查看数据库（可选）

```bash
npm run db:studio
```

浏览器会打开 Prisma Studio（http://localhost:5555），可以：
- 查看所有数据表
- 检查测试数据
- 手动添加/编辑数据

## 🎯 下一步

第一阶段完成后，可以开始第二阶段开发：

1. **商品管理功能**
   - 创建商品 CRUD 接口
   - 管理后台页面
   
2. **分类和标签系统**
   - 分类管理
   - 标签管理
   
3. **图片上传**
   - 集成 Cloudinary/Uploadcare
   - 图片管理功能

## 📝 当前环境信息

- **数据库**: Neon PostgreSQL
- **主机**: ep-divine-cell-aecflwbp.c-2.us-east-2.aws.neon.tech
- **数据库名**: neondb
- **测试数据**: 5 个商品记录
- **Prisma 版本**: 5.22.0

---

## 🚀 快速部署命令

如果需要触发新的部署（代码有更新时）：

```bash
# 1. 提交更改
git add .
git commit -m "feat: 完成第一阶段开发和测试"

# 2. 推送到 GitHub（触发自动部署）
git push origin dev

# 3. 查看部署状态
# 访问 Netlify Dashboard
```

---

**祝测试顺利！** 🎉

