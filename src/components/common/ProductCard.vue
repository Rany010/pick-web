<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden card-hover transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <router-link :to="`/products/${product.id}`">
      <!-- Product Image -->
      <div class="relative bg-gray-100 aspect-square">
        <img 
          :src="product.image" 
          :alt="product.name" 
          class="w-full h-full object-cover"
          width="500"
          height="500"
          loading="lazy"
          decoding="async"
        >
      </div>
      
      <!-- Product Info -->
      <div class="p-6">
        <h3 class="text-xl font-bold mb-2 text-dark">{{ product.name }}</h3>
        
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
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})
</script>

