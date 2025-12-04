<template>
  <div class="min-h-screen bg-light">
    <Navbar />
    
    <!-- Loading State -->
    <div v-if="loading" class="pt-32 pb-16 text-center">
      <div class="container mx-auto px-4">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <p class="mt-4 text-gray-600">Loading product details...</p>
      </div>
    </div>
    
    <!-- Product Details -->
    <div v-else-if="product" class="pt-24 pb-16">
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
              <div class="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                <img 
                  :src="selectedImage" 
                  :alt="product.name" 
                  class="w-full h-full object-cover"
                  width="500"
                  height="500"
                  loading="eager"
                >
              </div>
              <div v-if="product.images.length > 1" class="flex gap-3 overflow-x-auto pb-2">
                <div
                  v-for="(image, index) in product.images" 
                  :key="index"
                  :class="[
                    'w-20 h-20 flex-shrink-0 rounded-md cursor-pointer border-2 transition-all overflow-hidden',
                    selectedImage === image ? 'border-primary' : 'border-transparent hover:border-primary'
                  ]"
                  @click="selectedImage = image"
                >
                  <img 
                    :src="image" 
                    :alt="`${product.name} ${index + 1}`" 
                    class="w-full h-full object-cover"
                    width="80"
                    height="80"
                    loading="lazy"
                  >
                </div>
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
              <div class="flex justify-center">
                <a 
                  href="https://wa.me/message/RWCLLSQ3XHEXB1" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-primary text-center inline-flex items-center justify-center gap-3 px-8 py-4 text-lg min-w-[280px] shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Contact Seller
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Related Products -->
        <div class="mt-16">
          <h2 class="text-2xl font-bold mb-8">You May Also Like</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
import { getProductDetail, getRelatedProducts } from '../../api/products'

const route = useRoute()
const productId = parseInt(route.params.id)

const product = ref(null)
const relatedProductsData = ref([])
const loading = ref(true) // 初始为 true，页面打开时显示加载状态
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
    // 优化：使用专用的相关商品API，避免查询所有商品
    // 1. 先获取商品详情
    const response = await getProductDetail(productId)
    product.value = transformProduct(response)
    selectedImage.value = product.value.images[0] || product.value.image
    
    // 2. 并行获取相关商品（后端直接返回同类别商品，无需前端筛选）
    getRelatedProducts(productId, 4)
      .then(relatedProducts => {
        relatedProductsData.value = relatedProducts.map(transformProduct)
      })
      .catch(err => {
        console.warn('加载相关商品失败:', err)
        relatedProductsData.value = [] // 失败时显示空列表，不影响主商品显示
      })
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


