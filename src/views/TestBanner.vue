<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Banner 测试页面</h1>
      
      <!-- API 测试 -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-xl font-bold mb-4">API 测试</h2>
        <button 
          @click="testBannerAPI" 
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          :disabled="loading"
        >
          {{ loading ? '加载中...' : '测试 Banner API' }}
        </button>
        
        <div v-if="apiResult" class="mt-4 p-4 bg-gray-50 rounded">
          <h3 class="font-bold">API 结果:</h3>
          <pre class="text-sm overflow-auto">{{ JSON.stringify(apiResult, null, 2) }}</pre>
        </div>
      </div>

      <!-- Banner 显示测试 -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-xl font-bold mb-4">Banner 显示测试</h2>
        
        <div class="mb-4">
          <p><strong>Banners 数量:</strong> {{ banners.length }}</p>
          <p><strong>Active Banner:</strong> {{ activeBanner ? 'Yes' : 'No' }}</p>
          <p v-if="activeBanner"><strong>Active Banner ID:</strong> {{ activeBanner.id }}</p>
        </div>

        <div v-if="activeBanner" class="border border-gray-300 rounded p-4">
          <h3 class="text-lg font-bold mb-2">{{ activeBanner.title }}</h3>
          <p v-if="activeBanner.subtitle" class="text-gray-600 mb-2">{{ activeBanner.subtitle }}</p>
          
          <div class="mb-4">
            <img 
              :src="activeBanner.imageUrl" 
              :alt="activeBanner.title"
              class="w-full max-w-md h-48 object-cover rounded"
              @error="handleImageError"
              @load="handleImageLoad"
            >
          </div>
          
          <div class="text-sm text-gray-500">
            <p><strong>Link URL:</strong> {{ activeBanner.linkUrl || 'N/A' }}</p>
            <p><strong>Button Text:</strong> {{ activeBanner.buttonText || 'N/A' }}</p>
            <p><strong>Is Active:</strong> {{ activeBanner.isActive }}</p>
            <p><strong>Sort Order:</strong> {{ activeBanner.sortOrder }}</p>
          </div>
        </div>

        <div v-else class="text-gray-500">
          没有找到激活的 Banner
        </div>
      </div>

      <!-- 所有 Banners 列表 -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold mb-4">所有 Banners</h2>
        
        <div v-if="banners.length === 0" class="text-gray-500">
          没有 Banner 数据
        </div>
        
        <div v-else class="space-y-4">
          <div 
            v-for="banner in banners" 
            :key="banner.id"
            class="border border-gray-200 rounded p-4"
          >
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold">{{ banner.title }}</h3>
              <span class="text-sm px-2 py-1 rounded" :class="banner.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ banner.isActive ? '激活' : '未激活' }}
              </span>
            </div>
            
            <p v-if="banner.subtitle" class="text-gray-600 text-sm mb-2">{{ banner.subtitle }}</p>
            
            <div class="text-xs text-gray-500">
              <p>ID: {{ banner.id }} | Sort: {{ banner.sortOrder }}</p>
              <p>Image: {{ banner.imageUrl ? (banner.imageUrl.startsWith('data:') ? 'Base64' : 'URL') : 'None' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getBanners } from '../api/products'

const banners = ref([])
const loading = ref(false)
const apiResult = ref(null)

const activeBanner = computed(() => {
  if (banners.value.length > 0) {
    return banners.value[0]
  }
  return null
})

const testBannerAPI = async () => {
  loading.value = true
  apiResult.value = null
  
  try {
    const result = await getBanners()
    apiResult.value = result
    
    if (result.success) {
      banners.value = result.data
    }
  } catch (error) {
    apiResult.value = { error: error.message }
  } finally {
    loading.value = false
  }
}

const handleImageError = (event) => {
  console.error('图片加载失败:', event.target.src)
  event.target.src = 'https://picsum.photos/seed/error/400/200'
}

const handleImageLoad = (event) => {
  console.log('图片加载成功')
}

onMounted(() => {
  testBannerAPI()
})
</script>
