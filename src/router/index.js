import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/user/Home.vue'
import Products from '../views/user/Products.vue'
import ProductDetail from '../views/user/ProductDetail.vue'
import TestPage from '../views/TestPage.vue'
import InitData from '../views/admin/InitData.vue'

const routes = [
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

export default router

