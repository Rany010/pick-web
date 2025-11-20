# 项目设计文档

## 一、项目概述

- **技术栈**：Vue 3 + Node.js
- **部署平台**：Netlify
- **数据库**：Netlify DB Neon
- **面向人群**：欧美用户
- **UI要求**：符合欧美用户审美（简洁、现代、响应式设计、交互动效优雅）


## 二、功能设计

### 2.1 用户端功能

#### 2.1.1 商品浏览
- 首页展示热门商品、新品推荐、促销商品
- 商品分类浏览（按类目、标签筛选）
- 商品搜索功能（支持关键词搜索）
- 商品排序（价格、评分、销量）
- 商品分页加载

#### 2.1.2 商品详情
- 商品图片轮播展示
- 商品基本信息（名称、价格、描述）
- 商品规格参数展示
- 商品特点列表
- 商品评分和评价展示
- 商品库存状态显示

#### 2.1.3 在线咨询
- 实时聊天窗口（接入第三方即时通讯工具或自建）
- 咨询表单提交（姓名、邮箱、电话、留言）
- 常见问题 FAQ 展示
- 邮件咨询功能

#### 2.1.4 多语言支持
- 英语为主要语言
- 支持货币单位切换（USD）

#### 2.1.5 响应式体验
- 移动端适配
- 触摸手势支持
- 快速加载优化

### 2.2 管理员功能

#### 2.2.1 商品管理
- 商品上架/下架/删除
- 商品信息编辑（标题、描述、价格、图片）
- 商品规格参数设置
- 商品库存管理
- 批量操作功能

#### 2.2.2 分类管理
- 类目增删改查
- 类目层级管理（主类目-子类目）
- 标签管理（用于商品筛选）
- 类目排序

#### 2.2.3 咨询管理
- 查看用户咨询列表
- 在线回复用户咨询
- 咨询状态管理（待处理/已回复/已关闭）
- 咨询记录归档

#### 2.2.4 内容管理
- 首页 Banner 管理
- 促销活动配置
- FAQ 管理

#### 2.2.5 权限管理
- 为管理员提供一个不同于普通用户的登录地址，进入后需要登录
- 成功登录就可以使用管理员功能

### 2.3 系统功能

#### 2.3.1 图片管理
- 图片上传（支持多图）
- 图片裁剪和压缩
- 图片CDN加速

#### 2.3.2 SEO优化
- Meta标签优化
- 结构化数据标记
- URL友好化
- Sitemap生成

#### 2.3.3 数据统计
- 访问量统计
- 商品浏览量统计
- 咨询量统计


## 三、商品信息
- 目前暂时提供已知部分，允许管理员添加类目-具体产品-标签等等

- **匹克球拍**：
  - 儿童匹克球拍
  - 碳纤维匹克球拍：
    - 冷压
    - 热压
  - 凯夫拉匹克球拍
- **匹克球**：
- **匹克配件**：
  - 球网
  - 球包
  - 匹克球机
  - 球拍盒
  - 匹克球拍橡胶环
  - 匹克球场地线
- **匹克球套装**：


## 四、架构设计

### 4.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                        Netlify CDN                           │
│                    (全球边缘节点分发)                         │
└───────────────────────────┬─────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
┌───────────▼──────────┐       ┌───────────▼──────────┐
│   Vue 3 前端应用      │       │   Node.js 后端服务    │
│  (SSR/SSG 渲染)      │       │  (Serverless函数)    │
│  - 商品展示          │◄──────┤  - API接口           │
│  - 用户交互          │       │  - 业务逻辑          │
│  - 管理后台          │       │  - 数据处理          │
└──────────────────────┘       └───────────┬──────────┘
                                           │
                               ┌───────────▼──────────┐
                               │   Netlify DB Neon    │
                               │   (PostgreSQL)       │
                               │  - 商品数据          │
                               │  - 用户咨询          │
                               │  - 系统配置          │
                               └──────────────────────┘
```

### 4.2 前端架构

#### 4.2.1 技术栈
- **框架**：Vue 3 (Composition API)
- **构建工具**：Vite
- **路由**：Vue Router 4
- **状态管理**：Pinia
- **UI框架**：
  - TailwindCSS（样式）
  - HeadlessUI（无样式组件）
  - Heroicons（图标）
- **请求库**：Axios
- **表单验证**：VeeValidate + Yup
- **富文本编辑器**：Tiptap（管理端）
- **图片处理**：Vue-advanced-cropper
- **国际化**：Vue I18n

#### 4.2.2 目录结构
```
/src
  /assets           # 静态资源
    /images
    /icons
  /components       # 通用组件
    /common         # 基础组件（Button, Input, Modal等）
    /product        # 商品相关组件
    /layout         # 布局组件
  /views            # 页面视图
    /user           # 用户端页面
      - Home.vue
      - Products.vue
      - ProductDetail.vue
      - Contact.vue
    /admin          # 管理端页面
      - Dashboard.vue
      - ProductManage.vue
      - CategoryManage.vue
      - InquiryManage.vue
  /stores           # Pinia状态管理
    - product.js
    - category.js
    - inquiry.js
    - admin.js
  /api              # API接口封装
    - product.js
    - category.js
    - inquiry.js
  /utils            # 工具函数
    - request.js    # Axios配置
    - format.js     # 格式化工具
    - validate.js   # 验证工具
  /composables      # 组合式函数
    - useProducts.js
    - useInquiry.js
  /router           # 路由配置
    - index.js
  /i18n             # 国际化配置
    /locales
      - en.json
  App.vue
  main.js
```

### 4.3 后端架构

#### 4.3.1 技术栈
- **运行时**：Node.js 18+
- **框架**：Express.js
- **ORM**：Prisma
- **认证**：JWT
- **图片存储**：Cloudinary / Netlify Blobs
- **数据验证**：Joi
- **环境变量**：dotenv

#### 4.3.2 Serverless Functions目录结构
```
/netlify/functions
  /api
    /products
      - list.js       # GET 获取商品列表
      - detail.js     # GET 获取商品详情
      - create.js     # POST 创建商品（管理员）
      - update.js     # PUT 更新商品（管理员）
      - delete.js     # DELETE 删除商品（管理员）
    /categories
      - list.js       # GET 获取分类列表
      - manage.js     # POST/PUT/DELETE 分类管理
    /inquiries
      - create.js     # POST 创建咨询
      - list.js       # GET 获取咨询列表（管理员）
      - reply.js      # POST 回复咨询（管理员）
    /auth
      - login.js      # POST 管理员登录
      - verify.js     # GET 验证token
    /upload
      - image.js      # POST 上传图片
  /utils
    - db.js           # 数据库连接
    - auth.js         # 认证中间件
    - response.js     # 统一响应格式
```

#### 4.3.3 API设计规范

**基础路径**：`/.netlify/functions/api`

**响应格式**：
```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "code": 200
}
```

**错误响应**：
```json
{
  "success": false,
  "error": "错误信息",
  "code": 400
}
```

### 4.4 数据库架构

#### 4.4.1 数据库选择
- **类型**：PostgreSQL (通过 Netlify DB Neon)
- **ORM**：Prisma
- **连接池**：Prisma自动管理

#### 4.4.2 数据库连接配置
```javascript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### 4.5 部署架构

#### 4.5.1 Netlify部署配置
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 4.5.2 环境变量
```
# 数据库
DATABASE_URL=postgresql://...

# JWT密钥
JWT_SECRET=your-secret-key

# 图片存储
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# 管理员初始账号
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=...
```

### 4.6 安全架构

#### 4.6.1 认证授权
- JWT token认证
- token过期时间：24小时
- 管理员操作需验证token

#### 4.6.2 数据安全
- 密码使用bcrypt加密
- SQL注入防护（Prisma ORM）
- XSS防护（前端输入过滤）
- CORS配置

#### 4.6.3 API限流
- 使用Netlify自带的rate limiting
- 防止暴力破解和DDoS


## 五、数据表设计

### 5.1 分类表 (categories)

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | INT | 分类ID | 主键，自增 |
| name_en | VARCHAR(100) | 分类名称(英文) | 非空 |
| slug | VARCHAR(100) | URL友好标识 | 唯一，非空 |
| parent_id | INT | 父分类ID | 外键，可空 |
| description | TEXT | 分类描述 | 可空 |
| icon | VARCHAR(255) | 分类图标URL | 可空 |
| sort_order | INT | 排序顺序 | 默认0 |
| is_active | BOOLEAN | 是否启用 | 默认true |
| created_at | TIMESTAMP | 创建时间 | 默认当前时间 |
| updated_at | TIMESTAMP | 更新时间 | 自动更新 |

**索引**：
- `idx_parent_id` ON `parent_id`
- `idx_slug` ON `slug`
- `idx_sort_order` ON `sort_order`

### 5.2 标签表 (tags)

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | INT | 标签ID | 主键，自增 |
| name_en | VARCHAR(50) | 标签名称(英文) | 唯一，非空 |
| slug | VARCHAR(50) | URL友好标识 | 唯一，非空 |
| created_at | TIMESTAMP | 创建时间 | 默认当前时间 |

### 5.3 商品表 (products)

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | INT | 商品ID | 主键，自增 |
| category_id | INT | 分类ID | 外键，非空 |
| name_en | VARCHAR(200) | 商品名称(英文) | 非空 |
| slug | VARCHAR(200) | URL友好标识 | 唯一，非空 |
| description | TEXT | 商品描述 | 可空 |
| features | JSON | 商品特点列表 | 可空 |
| specifications | JSON | 规格参数 | 可空 |
| price | DECIMAL(10,2) | 当前价格 | 非空 |
| original_price | DECIMAL(10,2) | 原价 | 可空 |
| currency | VARCHAR(3) | 货币单位 | 默认'USD' |
| stock | INT | 库存数量 | 默认0 |
| rating | DECIMAL(3,2) | 评分 | 0-5，默认0 |
| review_count | INT | 评价数量 | 默认0 |
| view_count | INT | 浏览次数 | 默认0 |
| is_featured | BOOLEAN | 是否热销 | 默认false |
| is_new | BOOLEAN | 是否新品 | 默认false |
| status | ENUM | 状态 | 'draft','active','inactive' |
| created_at | TIMESTAMP | 创建时间 | 默认当前时间 |
| updated_at | TIMESTAMP | 更新时间 | 自动更新 |

**索引**：
- `idx_category_id` ON `category_id`
- `idx_slug` ON `slug`
- `idx_status` ON `status`
- `idx_price` ON `price`
- `idx_rating` ON `rating`
- `idx_created_at` ON `created_at`

### 5.4 商品图片表 (product_images)

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | INT | 图片ID | 主键，自增 |
| product_id | INT | 商品ID | 外键，非空 |
| image_url | VARCHAR(500) | 图片URL | 非空 |
| thumbnail_url | VARCHAR(500) | 缩略图URL | 可空 |
| alt_text | VARCHAR(200) | 图片描述 | 可空 |
| sort_order | INT | 排序顺序 | 默认0 |
| is_primary | BOOLEAN | 是否主图 | 默认false |
| created_at | TIMESTAMP | 创建时间 | 默认当前时间 |

**索引**：
- `idx_product_id` ON `product_id`
- `idx_sort_order` ON `sort_order`

### 5.5 商品标签关联表 (product_tags)

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| product_id | INT | 商品ID | 外键，非空 |
| tag_id | INT | 标签ID | 外键，非空 |
| created_at | TIMESTAMP | 创建时间 | 默认当前时间 |

**主键**：`(product_id, tag_id)`

**索引**：
- `idx_product_id` ON `product_id`
- `idx_tag_id` ON `tag_id`

### 5.6 咨询表 (inquiries)

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | INT | 咨询ID | 主键，自增 |
| name | VARCHAR(100) | 客户姓名 | 非空 |
| email | VARCHAR(100) | 客户邮箱 | 非空 |
| phone | VARCHAR(20) | 客户电话 | 可空 |
| product_category | VARCHAR(50) | 感兴趣的商品分类 | 可空 |
| message | TEXT | 留言内容 | 非空 |
| status | ENUM | 状态 | 'pending','replied','closed' |
| reply | TEXT | 回复内容 | 可空 |
| replied_at | TIMESTAMP | 回复时间 | 可空 |
| created_at | TIMESTAMP | 创建时间 | 默认当前时间 |

**索引**：
- `idx_status` ON `status`
- `idx_created_at` ON `created_at`
- `idx_email` ON `email`

### 5.7 管理员表 (admins)

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | INT | 管理员ID | 主键，自增 |
| username | VARCHAR(50) | 用户名 | 唯一，非空 |
| email | VARCHAR(100) | 邮箱 | 唯一，非空 |
| password_hash | VARCHAR(255) | 密码哈希 | 非空 |
| role | ENUM | 角色 | 'admin','super_admin' |
| is_active | BOOLEAN | 是否启用 | 默认true |
| last_login_at | TIMESTAMP | 最后登录时间 | 可空 |
| created_at | TIMESTAMP | 创建时间 | 默认当前时间 |
| updated_at | TIMESTAMP | 更新时间 | 自动更新 |

**索引**：
- `idx_username` ON `username`
- `idx_email` ON `email`

### 5.8 Banner配置表 (banners)

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | INT | Banner ID | 主键，自增 |
| title | VARCHAR(200) | 标题 | 非空 |
| subtitle | VARCHAR(300) | 副标题 | 可空 |
| image_url | VARCHAR(500) | 图片URL | 非空 |
| link_url | VARCHAR(500) | 链接地址 | 可空 |
| button_text | VARCHAR(50) | 按钮文字 | 可空 |
| sort_order | INT | 排序顺序 | 默认0 |
| is_active | BOOLEAN | 是否启用 | 默认true |
| start_date | TIMESTAMP | 开始时间 | 可空 |
| end_date | TIMESTAMP | 结束时间 | 可空 |
| created_at | TIMESTAMP | 创建时间 | 默认当前时间 |
| updated_at | TIMESTAMP | 更新时间 | 自动更新 |

**索引**：
- `idx_sort_order` ON `sort_order`
- `idx_is_active` ON `is_active`

### 5.9 系统配置表 (settings)

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | INT | 配置ID | 主键，自增 |
| key | VARCHAR(100) | 配置键 | 唯一，非空 |
| value | TEXT | 配置值 | 可空 |
| description | VARCHAR(255) | 配置说明 | 可空 |
| type | VARCHAR(20) | 值类型 | 'string','number','boolean','json' |
| updated_at | TIMESTAMP | 更新时间 | 自动更新 |

**索引**：
- `idx_key` ON `key`

### 5.10 Prisma Schema示例

```prisma
model Category {
  id          Int       @id @default(autoincrement())
  nameEn      String    @map("name_en") @db.VarChar(100)
  slug        String    @unique @db.VarChar(100)
  parentId    Int?      @map("parent_id")
  description String?   @db.Text
  icon        String?   @db.VarChar(255)
  sortOrder   Int       @default(0) @map("sort_order")
  isActive    Boolean   @default(true) @map("is_active")
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")
  
  parent      Category?  @relation("CategoryToCategory", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryToCategory")
  products    Product[]
  
  @@index([parentId])
  @@index([slug])
  @@index([sortOrder])
  @@map("categories")
}

model Product {
  id            Int       @id @default(autoincrement())
  categoryId    Int       @map("category_id")
  nameEn        String    @map("name_en") @db.VarChar(200)
  slug          String    @unique @db.VarChar(200)
  description   String?   @db.Text
  features      Json?
  specifications Json?
  price         Decimal   @db.Decimal(10, 2)
  originalPrice Decimal?  @map("original_price") @db.Decimal(10, 2)
  currency      String    @default("USD") @db.VarChar(3)
  stock         Int       @default(0)
  rating        Decimal   @default(0) @db.Decimal(3, 2)
  reviewCount   Int       @default(0) @map("review_count")
  viewCount     Int       @default(0) @map("view_count")
  isFeatured    Boolean   @default(false) @map("is_featured")
  isNew         Boolean   @default(false) @map("is_new")
  status        ProductStatus @default(draft)
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  
  category      Category  @relation(fields: [categoryId], references: [id])
  images        ProductImage[]
  tags          ProductTag[]
  
  @@index([categoryId])
  @@index([slug])
  @@index([status])
  @@index([price])
  @@index([rating])
  @@index([createdAt])
  @@map("products")
}

enum ProductStatus {
  draft
  active
  inactive
}

// ... 其他模型类似定义
```


## 六、开发计划

### 6.1 第一阶段：系统搭建
1. 项目初始化和环境配置
2. 用户前端实现最简单的示例页面，点击按钮后和后端交互，查询数据库测试数据在前端展示
3. 完成功能1和2,走通整个流程即可

### 6.2 第二阶段：用户前端界面开发
1. 用户界面实现，实现商品的查看浏览，UI设计参考/home/yxt/workspace_yxt/demo/pick-web/design/ui.html
2. 暂时不与后端和数据库交互，使用示例数据完成界面开发

### 6.3 第三阶段：数据表实现+后端接口实现
1. 完成数据库表实现
2. 完成后端接口实现
3. 前端接入后端接口，访问数据库

### 6.4 第四阶段：管理员功能
1. 管理员界面实现，登录，商品管理
2. 接入后端接口
3. 接入数据库

### 6.5 第四阶段：管理员功能
- [ ] 在线咨询表单
- [ ] 咨询管理（管理端）
- [ ] 搜索和筛选功能
- [ ] 响应式适配

### 6.4 第四阶段：优化和部署（1周）
- [ ] SEO优化
- [ ] 性能优化
- [ ] 测试和Bug修复
- [ ] Netlify部署配置
- [ ] 域名配置和SSL