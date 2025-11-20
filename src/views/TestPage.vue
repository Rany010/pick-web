<template>
  <div class="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- 标题区域 -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-dark mb-4">
          🏓 Pick-Web Test Page
        </h1>
        <p class="text-lg text-gray-600">
          测试前后端连接 - 点击按钮从数据库获取测试数据
        </p>
      </div>

      <!-- 操作区域 -->
      <div class="card p-8 mb-8">
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            @click="fetchProducts" 
            :disabled="loading"
            class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">⏳ 加载中...</span>
            <span v-else>📦 获取商品数据</span>
          </button>
          
          <button 
            @click="clearData"
            :disabled="loading"
            class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🗑️ 清除数据
          </button>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-600 font-medium">❌ 错误：{{ error }}</p>
        </div>

        <!-- 成功提示 -->
        <div v-if="successMessage" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-green-600 font-medium">✅ {{ successMessage }}</p>
        </div>
      </div>

      <!-- 数据展示区域 -->
      <div v-if="products.length > 0" class="space-y-4">
        <div class="text-center mb-6">
          <h2 class="text-3xl font-bold text-dark">
            商品列表 ({{ products.length }} 个)
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="product in products" 
            :key="product.id"
            class="card p-6 hover:scale-105 transition-transform"
          >
            <div class="flex justify-between items-start mb-3">
              <h3 class="text-xl font-bold text-dark flex-1">
                {{ product.name }}
              </h3>
              <span class="text-2xl font-bold text-primary ml-4">
                ${{ product.price }}
              </span>
            </div>
            
            <p class="text-gray-600 mb-4">
              {{ product.description }}
            </p>
            
            <div class="flex justify-between items-center text-sm text-gray-500">
              <span>ID: {{ product.id }}</span>
              <span>{{ formatDate(product.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!loading && !error" class="card p-12 text-center">
        <div class="text-6xl mb-4">📭</div>
        <p class="text-xl text-gray-500">
          暂无数据，点击上方按钮获取数据
        </p>
      </div>

      <!-- 系统信息 -->
      <div class="mt-12 p-6 bg-white/50 rounded-lg border border-gray-200">
        <h3 class="text-lg font-semibold mb-3 text-dark">📊 系统信息</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">前端框架：</span>
            <span class="font-medium">Vue 3</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">后端：</span>
            <span class="font-medium">Netlify Functions</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">数据库：</span>
            <span class="font-medium">PostgreSQL (Neon)</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">状态：</span>
            <span class="font-medium text-green-600">{{ systemStatus }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getTestProducts } from '../api/test'

const products = ref([])
const loading = ref(false)
const error = ref('')
const successMessage = ref('')

const systemStatus = computed(() => {
  if (products.value.length > 0) return '✅ 已连接'
  return '⏳ 待测试'
})

// 获取商品数据
const fetchProducts = async () => {
  loading.value = true
  error.value = ''
  successMessage.value = ''
  
  try {
    const data = await getTestProducts()
    products.value = data
    successMessage.value = `成功加载 ${data.length} 个商品数据！`
    
    // 3秒后清除成功消息
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    error.value = err.message || '获取数据失败'
    products.value = []
  } finally {
    loading.value = false
  }
}

// 清除数据
const clearData = () => {
  products.value = []
  error.value = ''
  successMessage.value = '数据已清除'
  
  setTimeout(() => {
    successMessage.value = ''
  }, 2000)
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

