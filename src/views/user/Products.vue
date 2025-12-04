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
        
        <!-- Loading State - 骨架屏 -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div v-for="i in 8" :key="i" class="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
            <div class="aspect-square bg-gray-200"></div>
            <div class="p-4 md:p-6 space-y-4">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              <div class="flex justify-between items-center mt-4">
                <div class="h-6 bg-gray-200 rounded w-20"></div>
                <div class="h-8 bg-gray-200 rounded-full w-24"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="text-center py-16">
          <div class="text-6xl mb-4">⚠️</div>
          <h3 class="text-2xl font-bold text-dark mb-2">Failed to load products</h3>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button @click="loadProducts" class="btn-primary">Try Again</button>
        </div>
        
        <!-- Products Grid -->
        <div v-else-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <ProductCard 
            v-for="product in filteredProducts" 
            :key="product.id"
            :product="product"
          />
        </div>
        
        <!-- Empty State - 只在加载完成且确实没有产品时显示 -->
        <div v-else class="text-center py-16">
          <div class="text-6xl mb-4">📦</div>
          <h3 class="text-2xl font-bold text-dark mb-2">No products found</h3>
          <p class="text-gray-600 mb-4">Try selecting a different category</p>
          <button 
            v-if="selectedCategory !== 'all'"
            @click="selectedCategory = 'all'"
            class="btn-primary"
          >
            View All Products
          </button>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from '../../components/common/Navbar.vue'
import Footer from '../../components/common/Footer.vue'
import ProductCard from '../../components/common/ProductCard.vue'
import { getProductsList, getCategoriesList } from '../../api/products'

const selectedCategory = ref('all')
const categories = ref([{ id: 'all', name: 'All Products', slug: 'all' }])
const products = ref([])
const loading = ref(true) // 初始为 true，页面打开时显示加载状态
const error = ref(null)

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'all') {
    return products.value
  }
  return products.value.filter(p => p.category === selectedCategory.value)
})

// Load categories
const loadCategories = async () => {
  try {
    const response = await getCategoriesList()
    const apiCategories = response.map(c => ({
      id: c.slug,
      name: c.nameEn,
      slug: c.slug
    }))
    categories.value = [
      { id: 'all', name: 'All Products', slug: 'all' },
      ...apiCategories
    ]
  } catch (err) {
    console.error('加载分类失败:', err)
  }
}

// Load products
const loadProducts = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await getProductsList('all', 50, 0)
    // 按创建时间或 ID 排序，保持上传顺序
    const sortedProducts = [...response.products].sort((a, b) => {
      // 优先按 createdAt 排序，如果没有则按 ID 排序
      if (a.createdAt && b.createdAt) {
        return new Date(a.createdAt) - new Date(b.createdAt)
      }
      return (a.id || 0) - (b.id || 0)
    })
    
    products.value = sortedProducts.map(p => ({
      id: p.id,
      name: p.nameEn,
      slug: p.slug,
      category: p.category?.slug || 'unknown',
      description: p.description,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
      rating: Number(p.rating),
      reviewCount: p.reviewCount,
      badge: p.isFeatured ? 'Best Seller' : (p.isNew ? 'New' : null),
      // 确保图片按上传顺序显示
      image: p.images && p.images.length > 0 ? p.images[0].imageUrl : '/placeholder-product.svg',
      images: p.images ? p.images.map(img => img.imageUrl || '/placeholder-product.svg') : ['/placeholder-product.svg'],
      features: p.features || [],
      specifications: p.specifications || {},
      stock: p.stock,
      isFeatured: p.isFeatured,
      isNew: p.isNew,
      createdAt: p.createdAt
    }))
  } catch (err) {
    error.value = err.message
    console.error('Failed to load products:', err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadCategories()
  await loadProducts()
})
</script>

