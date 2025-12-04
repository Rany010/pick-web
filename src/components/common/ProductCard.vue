<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden card-hover transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full group">
    <router-link :to="`/products/${product.id}`" class="flex flex-col h-full" :aria-label="`View details for ${product.name}`">
      <!-- Product Image -->
      <div class="relative bg-gray-100 aspect-square flex-shrink-0 overflow-hidden">
        <img 
          :src="product.image" 
          :alt="product.name" 
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          width="500"
          height="500"
          loading="lazy"
          decoding="async"
          @error="handleImageError"
          @load="handleImageLoad"
        >
        <!-- 图片加载遮罩 -->
        <div class="absolute inset-0 bg-gray-200 animate-pulse" v-if="imageLoading"></div>
      </div>
      
      <!-- Product Info -->
      <div class="p-4 md:p-6 flex flex-col flex-grow">
        <h3 class="text-base font-bold mb-4 text-dark line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">
          {{ product.name }}
        </h3>
        
        <!-- Price and Button - 固定在底部 -->
        <div class="flex justify-between items-center mt-auto gap-2">
          <div class="flex flex-col">
            <span class="text-primary font-bold text-xl">${{ formatPrice(product.price) }}</span>
            <span v-if="product.originalPrice" class="text-gray-400 line-through text-sm">
              ${{ formatPrice(product.originalPrice) }}
            </span>
          </div>
          <button 
            class="bg-primary/10 text-primary px-3 md:px-4 py-2 rounded-full font-medium hover:bg-primary hover:text-white transition-all duration-300 whitespace-nowrap text-sm md:text-base"
            @click.prevent="$router.push(`/products/${product.id}`)"
          >
            View Details
          </button>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const imageLoading = ref(true)

const formatPrice = (price) => {
  if (!price) return '0.00'
  return Number(price).toFixed(2)
}

const handleImageError = (event) => {
  event.target.src = '/placeholder-product.svg'
  imageLoading.value = false
}

// 图片加载完成后隐藏加载状态
const handleImageLoad = () => {
  imageLoading.value = false
}
</script>

