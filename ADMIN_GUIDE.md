# 📖 管理员功能使用指南

## 🚀 快速开始

### 1. 初始化管理员账号

```bash
npm run db:seed-admin
```

**默认登录信息：**
- 用户名：`admin`
- 密码：`admin123456`
- 角色：`super_admin`

### 2. 启动开发服务器

```bash
npx netlify dev
```

服务器启动后访问：http://localhost:8888

### 3. 登录管理后台

访问：http://localhost:8888/admin/login

输入默认用户名和密码即可登录。

## 📋 功能说明

### 商品管理

访问路径：`/admin/products`

#### 功能列表

1. **查看商品列表**
   - 显示所有商品的信息（名称、分类、价格、库存、状态等）
   - 每页显示 20 条记录

2. **筛选功能**
   - **按分类筛选**：选择特定分类查看商品
   - **按状态筛选**：Active（已发布）、Draft（草稿）、Inactive（已下架）
   - **搜索**：根据商品名称、slug 或描述搜索

3. **删除商品**
   - 点击 "Delete" 按钮
   - 确认后商品及其相关数据（图片、标签）将被删除

4. **分页浏览**
   - 使用底部的 "Previous" 和 "Next" 按钮翻页
   - 显示当前页码和总记录数

5. **添加/编辑商品** （UI 占位）
   - 当前可以通过 `/admin/init` 页面批量初始化数据
   - 完整的表单编辑功能待后续完善

## 🔐 安全说明

### Token 管理

- Token 有效期：24 小时
- Token 存储位置：浏览器 localStorage
- 过期后需要重新登录

### 权限验证

- 所有 `/admin/*` 路径（除登录页）都需要认证
- 未登录访问会自动跳转到登录页
- 所有管理员 API 都需要在请求头中携带 Token

### 密码安全

- 密码使用 bcrypt 加密存储
- 建议首次登录后修改默认密码
- 生产环境请使用强密码

## 🛠️ 常见操作

### 批量添加商品

访问数据初始化页面：`/admin/init`

点击 "Initialize Sample Data" 可以快速创建示例商品数据。

### 修改管理员密码

目前暂未提供 UI 修改密码功能，可以通过数据库直接修改：

```bash
# 打开 Prisma Studio
npm run db:studio

# 在浏览器中修改 admins 表的 password_hash 字段
```

或者创建新脚本重置密码。

### 退出登录

点击右上角的 "Logout" 按钮即可退出。

## 🐛 故障排除

### 登录失败

1. 检查管理员账号是否已创建：`npm run db:seed-admin`
2. 确认用户名和密码正确
3. 检查数据库连接是否正常

### Token 过期

如果提示 Token 无效或过期：
1. 重新登录获取新 Token
2. 检查系统时间是否正确

### 无法删除商品

1. 确认已登录且 Token 有效
2. 检查浏览器控制台是否有错误信息
3. 确认数据库连接正常

## 📊 API 测试

可以使用 Postman 或 curl 测试 API：

### 登录获取 Token

```bash
curl -X POST http://localhost:8888/api/auth-login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123456"}'
```

### 获取商品列表（需要 Token）

```bash
curl -X GET "http://localhost:8888/api/admin-products-list?limit=10&offset=0" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 删除商品（需要 Token）

```bash
curl -X DELETE "http://localhost:8888/api/admin-product-delete?id=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📝 后续开发计划

- [ ] 完整的商品编辑表单
- [ ] 图片上传和管理
- [ ] 分类管理功能
- [ ] 咨询管理功能
- [ ] 数据统计面板
- [ ] 密码修改功能
- [ ] 管理员账号管理

## 💡 提示

1. **开发环境**：使用 `npx netlify dev` 启动，可以同时运行前端和后端
2. **数据库**：使用 `npm run db:studio` 可视化管理数据库
3. **日志**：后端接口会在控制台输出详细日志，便于调试
4. **备份**：定期备份数据库，避免数据丢失

---

如有问题，请参考 [STAGE4_COMPLETE.md](STAGE4_COMPLETE.md) 了解更多技术细节。

