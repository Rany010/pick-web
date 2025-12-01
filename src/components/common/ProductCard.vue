<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden card-hover transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <router-link :to="`/products/${product.id}`">
      <!-- Product Image -->
      <div class="relative bg-gray-100 aspect-square">
        <img 
          :src="product.image" 
          :alt="product.name" 
          class="w-full h-full object-cover"
          width="800"
          height="800"
          loading="lazy"
          decoding="async"
        >
        <div 
          v-if="product.badge" 
          :class="['absolute top-4 right-4 text-white text-sm font-medium px-3 py-1 rounded-full', badgeColor]"
        >
          {{ product.badge }}
        </div>
      </div>
      
      <!-- Product Info -->
      <div class="p-6">
        <h3 class="text-xl font-bold mb-2 text-dark">{{ product.name }}</h3>
        
        <!-- Rating -->
        <div class="flex items-center mb-3">
          <div class="flex text-accent">
            <template v-for="i in 5" :key="i">
              <svg v-if="i <= Math.floor(product.rating)" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
              <svg v-else-if="i - 0.5 <= product.rating" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0v15z"/>
              </svg>
              <svg v-else class="w-4 h-4 fill-current text-gray-300" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            </template>
          </div>
          <span class="text-gray-500 ml-2 text-sm">({{ product.rating }})</span>
        </div>
        
        <!-- Description -->
        <p class="text-gray-600 mb-4 line-clamp-2">{{ product.description }}</p>
        
        <!-- Price and Button -->
        <div class="flex justify-between items-center">
          <div>
            <span class="text-primary font-bold text-xl">${{ product.price }}</span>
            <span v-if="product.originalPrice" class="text-gray-400 line-through ml-2 text-sm">
              ${{ product.originalPrice }}
            </span>
          </div>
          <button class="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium hover:bg-primary/20 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const badgeColor = computed(() => {
  switch (props.product.badge) {
    case 'Hot':
    case 'Best Seller':
      return 'bg-primary'
    case 'New':
      return 'bg-secondary'
    case 'Sale':
    case 'Limited':
      return 'bg-accent text-dark'
    default:
      return 'bg-primary'
  }
})
</script>

