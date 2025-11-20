<template>
  <div class="min-h-screen bg-light">
    <Navbar />
    
    <!-- Page Header -->
    <section class="pt-24 pb-8 bg-gradient-to-br from-primary/10 to-secondary/10">
      <div class="container mx-auto px-4">
        <h1 class="text-[clamp(2rem,5vw,3rem)] font-bold text-dark mb-4">Our Products</h1>
        <p class="text-lg text-gray-700 max-w-2xl">Browse our complete collection of professional pickleball equipment</p>
      </div>
    </section>

    <!-- Products Section -->
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <!-- Category Filter -->
        <div class="flex justify-center mb-12 overflow-x-auto pb-2">
          <div class="inline-flex bg-gray-100 rounded-full p-1">
            <button 
              v-for="category in categories" 
              :key="category.id"
              @click="selectedCategory = category.id"
              :class="[
                'px-6 py-2 rounded-full font-medium transition-all duration-300',
                selectedCategory === category.id 
                  ? 'text-primary bg-white shadow-sm' 
                  : 'text-gray-600 hover:text-primary'
              ]"
            >
              {{ category.name }}
            </button>
          </div>
        </div>
        
        <!-- Products Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProductCard 
            v-for="product in filteredProducts" 
            :key="product.id"
            :product="product"
          />
        </div>
        
        <!-- Empty State -->
        <div v-if="filteredProducts.length === 0" class="text-center py-16">
          <div class="text-6xl mb-4">📦</div>
          <h3 class="text-2xl font-bold text-dark mb-2">No products found</h3>
          <p class="text-gray-600">Try selecting a different category</p>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Navbar from '../../components/common/Navbar.vue'
import Footer from '../../components/common/Footer.vue'
import ProductCard from '../../components/common/ProductCard.vue'
import { mockProducts, mockCategories } from '../../data/mockProducts'

const selectedCategory = ref('all')
const categories = mockCategories

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'all') {
    return mockProducts
  }
  return mockProducts.filter(p => p.category === selectedCategory.value)
})
</script>

