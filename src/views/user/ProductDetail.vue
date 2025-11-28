<template>
  <div class="min-h-screen bg-light">
    <Navbar />
    
    <div v-if="product" class="pt-24 pb-16">
      <div class="container mx-auto px-4">
        <!-- Breadcrumb -->
        <div class="mb-8 text-sm text-gray-600">
          <router-link to="/" class="hover:text-primary">Home</router-link>
          <span class="mx-2">/</span>
          <router-link to="/products" class="hover:text-primary">Products</router-link>
          <span class="mx-2">/</span>
          <span class="text-dark">{{ product.name }}</span>
        </div>

        <!-- Product Details -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            <!-- Product Images -->
            <div class="product-images">
              <img 
                :src="selectedImage" 
                :alt="product.name" 
                class="w-full h-80 object-cover rounded-lg mb-4"
              >
              <div v-if="product.images.length > 1" class="flex gap-3 overflow-x-auto pb-2">
                <img 
                  v-for="(image, index) in product.images" 
                  :key="index"
                  :src="image" 
                  :alt="`${product.name} ${index + 1}`" 
                  :class="[
                    'w-20 h-20 object-cover rounded-md cursor-pointer border-2 transition-all',
                    selectedImage === image ? 'border-primary' : 'border-transparent hover:border-primary'
                  ]"
                  @click="selectedImage = image"
                >
              </div>
            </div>
            
            <!-- Product Info -->
            <div class="product-info">
              <div v-if="product.badge" :class="['inline-block text-white text-sm font-medium px-3 py-1 rounded-full mb-4', badgeColor]">
                {{ product.badge }}
              </div>
              
              <h1 class="text-3xl font-bold mb-3 text-dark">{{ product.name }}</h1>
              
              <!-- Rating -->
              <div class="flex items-center mb-4">
                <div class="flex text-accent">
                  <template v-for="i in 5" :key="i">
                    <svg v-if="i <= Math.floor(product.rating)" class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                    <svg v-else-if="i - 0.5 <= product.rating" class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0v15z"/>
                    </svg>
                    <svg v-else class="w-5 h-5 fill-current text-gray-300" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  </template>
                </div>
                <span class="text-gray-500 ml-2">({{ product.rating }} · {{ product.reviewCount }} reviews)</span>
              </div>
              
              <!-- Price -->
              <div class="mb-6">
                <span class="text-primary font-bold text-3xl">${{ product.price }}</span>
                <span v-if="product.originalPrice" class="text-gray-400 line-through ml-3 text-xl">
                  ${{ product.originalPrice }}
                </span>
                <span v-if="product.originalPrice" class="ml-3 text-green-600 font-medium">
                  Save ${{ (product.originalPrice - product.price).toFixed(2) }}
                </span>
              </div>
              
              <!-- Description -->
              <p class="text-gray-700 text-lg mb-6">{{ product.description }}</p>
              
              <!-- Stock Status -->
              <div class="mb-6">
                <span :class="['font-medium', product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600']">
                  <template v-if="product.stock > 10">✓ In Stock</template>
                  <template v-else-if="product.stock > 0">⚠ Only {{ product.stock }} left!</template>
                  <template v-else>✗ Out of Stock</template>
                </span>
              </div>
              
              <!-- Features -->
              <div class="border-t border-b border-gray-100 py-6 mb-6">
                <h4 class="font-semibold text-lg mb-3">Key Features:</h4>
                <ul class="space-y-2">
                  <li v-for="(feature, index) in product.features" :key="index" class="flex items-start text-gray-700">
                    <svg class="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>{{ feature }}</span>
                  </li>
                </ul>
              </div>
              
              <!-- Specifications -->
              <div class="mb-8">
                <h4 class="font-semibold text-lg mb-3">Specifications:</h4>
                <div class="grid grid-cols-2 gap-3 text-gray-700">
                  <div v-for="(value, key) in product.specifications" :key="key">
                    <span class="font-medium">{{ formatSpecKey(key) }}:</span>
                    <span class="ml-2">{{ value }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row gap-4">
                <a href="#contact" class="btn-primary text-center flex-1">
                  Contact Seller
                </a>
                <button class="border-2 border-primary text-primary px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-primary/10 flex-1">
                  <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Related Products -->
        <div class="mt-16">
          <h2 class="text-2xl font-bold mb-8">You May Also Like</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProductCard 
              v-for="relatedProduct in relatedProducts" 
              :key="relatedProduct.id"
              :product="relatedProduct"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Product Not Found -->
    <div v-else class="pt-32 pb-16 text-center">
      <div class="container mx-auto px-4">
        <div class="text-6xl mb-4">😕</div>
        <h2 class="text-3xl font-bold mb-4">Product Not Found</h2>
        <p class="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
        <router-link to="/products" class="btn-primary inline-block">
          Browse All Products
        </router-link>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '../../components/common/Navbar.vue'
import Footer from '../../components/common/Footer.vue'
import ProductCard from '../../components/common/ProductCard.vue'
import { getProductDetail, getProductsList } from '../../api/products'

const route = useRoute()
const productId = parseInt(route.params.id)

const product = ref(null)
const relatedProductsData = ref([])
const loading = ref(false)
const error = ref(null)
const selectedImage = ref('')

const badgeColor = computed(() => {
  if (!product.value?.badge) return ''
  switch (product.value.badge) {
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

const relatedProducts = computed(() => {
  return relatedProductsData.value
})

const formatSpecKey = (key) => {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
}

// Transform API response to component format
// 后端 API 已经返回完整 URL，直接使用即可
const transformProduct = (p) => ({
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
  image: p.images[0]?.imageUrl || '/placeholder-product.svg', // 后端已返回完整 URL
  images: p.images.map(img => img.imageUrl || '/placeholder-product.svg'), // 后端已返回完整 URL
  features: p.features || [],
  specifications: p.specifications || {},
  stock: p.stock,
  isFeatured: p.isFeatured,
  isNew: p.isNew
})

// Load product
const loadProduct = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await getProductDetail(productId)
    product.value = transformProduct(response)
    selectedImage.value = product.value.images[0] || product.value.image
    
    // Load related products
    const relatedResponse = await getProductsList(product.value.category, 4, 0)
    relatedProductsData.value = relatedResponse.products
      .filter(p => p.id !== productId)
      .slice(0, 3)
      .map(transformProduct)
  } catch (err) {
    error.value = err.message
    console.error('加载商品详情失败:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProduct()
})

// Watch route changes
watch(() => route.params.id, () => {
  if (route.params.id) {
    loadProduct()
  }
})
</script>

<style scoped>
.btn-primary {
  @apply bg-primary text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-primary/90 hover:shadow-lg;
}
</style>

