import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/user/Home.vue'
import Products from '../views/user/Products.vue'
import ProductDetail from '../views/user/ProductDetail.vue'
import TestPage from '../views/TestPage.vue'
import TestBanner from '../views/TestBanner.vue'
import InitData from '../views/admin/InitData.vue'
import AdminLogin from '../views/admin/AdminLogin.vue'
import ProductManage from '../views/admin/ProductManage.vue'
import BannerManage from '../views/admin/BannerManage.vue'

const routes = [
  // 用户端路由
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: ProductDetail,
  },
  {
    path: '/test',
    name: 'Test',
    component: TestPage,
  },
  {
    path: '/test-banner',
    name: 'TestBanner',
    component: TestBanner,
  },
  // 管理员路由
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin,
  },
  {
    path: '/admin/products',
    name: 'ProductManage',
    component: ProductManage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/banners',
    name: 'BannerManage',
    component: BannerManage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/init',
    name: 'InitData',
    component: InitData,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    } else {
      return { top: 0 }
    }
  },
})

// 路由守卫 - 检查管理员认证
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      next('/admin/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router

