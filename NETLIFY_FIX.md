# 🔧 修复 Netlify 502 错误

## 问题原因

1. ❌ Prisma Client 未在 Netlify 构建时生成
2. ❌ 环境变量命名不匹配（需要设置 `DATABASE_URL`）

## ✅ 已修复

- [x] `package.json` - 添加 `postinstall` 脚本自动生成 Prisma Client
- [x] `netlify.toml` - 配置 Prisma 二进制目标
- [x] `db.js` - 支持读取 Netlify 的 `NETLIFY_DATABASE_URL_UNPOOLED`

## 🚀 部署修复

### 步骤 1: 在 Netlify 设置环境变量

访问 Netlify Dashboard 并添加环境变量：

1. **登录 Netlify Dashboard**
   ```
   https://app.netlify.com/sites/pick-web/configuration/env
   ```

2. **添加 DATABASE_URL 环境变量**
   
   点击 "Add a variable" 或 "New variable"
   
   - **Key**: `DATABASE_URL`
   - **Values for all scopes**: 
     ```
     postgresql://neondb_owner:npg_K8DeBRNoZ2bf@ep-divine-cell-aecflwbp.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require
     ```
   
   ⚠️ **重要**: 选择所有作用域（Production, Deploy Preview, Branch deploy）

3. **点击 "Create variable" 保存**

### 步骤 2: 提交更新并重新部署

```bash
# 1. 查看修改
git status

# 2. 提交修改
git add .
git commit -m "fix: 修复 Netlify Functions 502 错误 - 添加 Prisma 生成和环境变量支持"

# 3. 推送到 GitHub（自动触发 Netlify 部署）
git push origin dev
```

### 步骤 3: 监控部署

1. **查看构建日志**
   - 访问 Netlify Dashboard > Deploys
   - 点击正在进行的部署
   - 查看 "Deploy log"
   
2. **检查关键输出**
   应该看到：
   ```
   ✔ Generated Prisma Client
   ```

3. **部署完成后测试**
   - 访问您的站点
   - 点击 "获取商品数据"
   - 应该能成功显示 5 个商品

## 🔍 故障排查

### 如果仍然出现 502 错误

**检查 Function 日志：**

1. Netlify Dashboard > Functions
2. 点击 `test-products` 函数
3. 查看实时日志，查找错误信息

**常见错误：**

#### 错误 1: "Can't reach database server"
```
解决方案：检查 DATABASE_URL 是否正确设置
```

#### 错误 2: "Prisma Client not found"
```
解决方案：
1. 确认 package.json 中有 postinstall 脚本
2. 触发重新部署
3. 检查构建日志确认 Prisma 生成成功
```

#### 错误 3: "Environment variable not found"
```
解决方案：
1. 检查 Netlify 环境变量是否正确设置
2. 确保选择了所有作用域
3. 重新部署
```

## 📋 验证清单

部署后验证以下内容：

- [ ] Netlify 构建成功（绿色勾号）
- [ ] 构建日志中显示 "Generated Prisma Client"
- [ ] 环境变量 `DATABASE_URL` 已设置
- [ ] Functions 标签显示 `test-products` 函数
- [ ] 访问站点，点击按钮能获取数据
- [ ] 浏览器控制台无错误

## 🎯 预期结果

修复后，点击 "获取商品数据" 应该显示：

```
✅ 成功加载 5 个商品数据！
```

并显示以下商品卡片：
1. Carbon Fiber Pickleball Paddle - $89.99
2. Kids Pickleball Paddle Set - $39.99
3. Pickleball Net System - $129.99
4. Premium Pickleball Balls (12-pack) - $24.99
5. Pickleball Paddle Bag - $54.99

## 📞 还是无法解决？

如果按照以上步骤仍然无法解决，请提供：

1. **Netlify 构建日志**（完整）
2. **Function 错误日志**
3. **浏览器控制台截图**

---

**下一步**: 提交代码并在 Netlify 添加环境变量后，等待部署完成即可！

