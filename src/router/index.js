import { createRouter, createWebHistory } from 'vue-router'
import TestPage from '../views/TestPage.vue'

const routes = [
  {
    path: '/',
    name: 'Test',
    component: TestPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

