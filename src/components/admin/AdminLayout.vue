<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Top Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and Nav Links -->
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-2xl font-bold text-orange-600">Admin Panel</h1>
            </div>
            <div class="hidden sm:ml-8 sm:flex sm:space-x-8">
              <router-link
                to="/admin/products"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                :class="isActive('/admin/products') ? 'border-orange-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
              >
                Products
              </router-link>
            </div>
          </div>

          <!-- User Menu -->
          <div class="flex items-center">
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-700">{{ adminUser?.username || 'Admin' }}</span>
              <button
                @click="handleLogout"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile menu (hidden by default) -->
    <div class="sm:hidden bg-white border-b border-gray-200">
      <div class="pt-2 pb-3 space-y-1">
        <router-link
          to="/admin/products"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors"
          :class="isActive('/admin/products') ? 'border-orange-500 text-orange-700 bg-orange-50' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'"
        >
          Products
        </router-link>
      </div>
    </div>

    <!-- Main Content -->
    <main class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const adminUser = ref(null)

onMounted(() => {
  // 获取管理员信息
  const userStr = localStorage.getItem('admin_user')
  if (userStr) {
    adminUser.value = JSON.parse(userStr)
  }
})

const isActive = (path) => {
  return route.path.startsWith(path)
}

const handleLogout = () => {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
  router.push('/admin/login')
}
</script>

