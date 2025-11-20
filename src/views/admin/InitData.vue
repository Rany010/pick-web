<template>
  <div class="min-h-screen bg-light flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
      <h1 class="text-2xl font-bold text-dark mb-6 text-center">初始化数据库数据</h1>
      
      <div v-if="!initialized" class="space-y-4">
        <p class="text-gray-600 text-center">
          点击下面的按钮初始化数据库，填充商品、分类和标签数据。
        </p>
        
        <button 
          @click="initializeData"
          :disabled="loading"
          class="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">⏳ 初始化中...</span>
          <span v-else>🚀 初始化数据</span>
        </button>
        
        <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-600 text-sm">❌ {{ error }}</p>
        </div>
      </div>
      
      <div v-else class="space-y-4">
        <div class="text-center">
          <div class="text-6xl mb-4">✅</div>
          <h2 class="text-xl font-bold text-green-600 mb-2">初始化成功！</h2>
          <p class="text-gray-600 mb-4">数据已成功填充到数据库</p>
        </div>
        
        <div v-if="result" class="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-sm text-gray-700">
            • 分类: {{ result.categories }} 个<br>
            • 标签: {{ result.tags }} 个<br>
            • 商品: {{ result.products }} 个
          </p>
        </div>
        
        <div class="flex flex-col gap-3">
          <router-link to="/" class="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold text-center transition-all duration-300 hover:bg-primary/90">
            返回首页
          </router-link>
          <router-link to="/products" class="w-full border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold text-center transition-all duration-300 hover:bg-primary/10">
            查看商品
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { seedData } from '../../api/products'

const loading = ref(false)
const error = ref(null)
const initialized = ref(false)
const result = ref(null)

const initializeData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await seedData()
    result.value = response
    initialized.value = true
  } catch (err) {
    error.value = err.message || '初始化失败，请重试'
    console.error('初始化数据失败:', err)
  } finally {
    loading.value = false
  }
}
</script>

