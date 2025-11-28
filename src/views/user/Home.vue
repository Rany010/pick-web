<template>
  <div class="min-h-screen bg-light">
    <Navbar />
    
    <!-- Hero Section with Banner Carousel -->
    <section class="pt-20 md:pt-24 pb-6 md:pb-8 bg-gradient-to-br from-primary/10 via-white to-secondary/10">
      <div class="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div class="md:w-1/2">
          
          <!-- 加载中状态 -->
          <template v-if="loading">
            <div class="animate-pulse">
              <div class="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div class="h-8 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div class="flex gap-4">
                <div class="h-12 bg-gray-200 rounded-full w-32"></div>
                <div class="h-12 bg-gray-200 rounded-full w-32"></div>
              </div>
            </div>
          </template>
          
          <!-- Banner 内容 -->
          <template v-else-if="activeBanner">
            <h1 class="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight text-dark mb-4 transition-opacity duration-500">
              {{ activeBanner.title || 'Premium Pickleball Equipment' }}<br>
              <span class="text-primary" v-if="bannerSubtitle">{{ bannerSubtitle }}</span>
              <span class="text-primary" v-else>Elevate Your Game</span>
            </h1>
            <div class="flex flex-col sm:flex-row gap-4 mt-8">
              <router-link 
                :to="activeBanner.linkUrl || '/products'" 
                class="btn-primary text-center"
              >
                {{ activeBanner.buttonText || 'Shop Now' }}
              </router-link>
              <a href="#about" class="btn-secondary text-center">
                Learn More
              </a>
            </div>
          </template>
          
          <!-- 默认内容（无 Banner 时） -->
          <template v-else>
            <h1 class="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight text-dark mb-4">
              Premium Pickleball Equipment,<br>
              <span class="text-primary">Elevate Your Game</span>
            </h1>
            <div class="flex flex-col sm:flex-row gap-4 mt-8">
              <router-link to="/products" class="btn-primary text-center">
                Shop Now
              </router-link>
              <a href="#about" class="btn-secondary text-center">
                Learn More
              </a>
            </div>
          </template>
        </div>
        
        <div class="md:w-1/2 mt-12 md:mt-0">
          <div class="relative">
            <!-- Banner 图片轮播 -->
            <div class="relative overflow-hidden rounded-xl shadow-2xl">
              <!-- 加载中骨架屏 -->
              <div v-if="loading" class="w-full h-[300px] md:h-[400px] bg-gray-200 animate-pulse"></div>
              <!-- 实际 Banner 图片 -->
              <transition v-else name="banner-fade" mode="out-in">
                <img 
                  :key="currentBannerIndex"
                  :src="activeBanner?.imageUrl || 'https://picsum.photos/seed/hero/600/400'" 
                  alt="Pickleball Equipment" 
                  class="w-full object-cover h-[300px] md:h-[400px]"
                  @error="handleImageError"
                >
              </transition>
            </div>
            
            <!-- 轮播指示器 -->
            <div v-if="banners.length > 1" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <button 
                v-for="(banner, index) in banners" 
                :key="banner.id"
                @click="goToBanner(index)"
                :class="[
                  'w-3 h-3 rounded-full transition-all duration-300',
                  currentBannerIndex === index 
                    ? 'bg-primary w-8' 
                    : 'bg-white/70 hover:bg-white'
                ]"
                :aria-label="`Go to banner ${index + 1}`"
              />
            </div>
            
            <!-- 左右箭头 -->
            <template v-if="banners.length > 1">
              <button 
                @click="prevBanner"
                class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                aria-label="Previous banner"
              >
                <svg class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <button 
                @click="nextBanner"
                class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                aria-label="Next banner"
              >
                <svg class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </template>
            
            <!-- 折扣标签 - 使用 subtitle 字段，格式如 "标题文字|Special Offer|20% OFF" -->
            <div 
              v-if="bannerPromoTag"
              class="absolute -bottom-6 -left-6 bg-accent text-dark p-4 rounded-lg shadow-lg transform rotate-3"
            >
              <p class="font-bold text-lg">{{ bannerPromoTag.title }}</p>
              <p class="text-sm">{{ bannerPromoTag.discount }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="py-8 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-6 fade-in">
          <h2 class="text-[clamp(1.5rem,4vw,2rem)] font-bold text-dark mb-1">Featured Products</h2>
          <p class="text-gray-600 max-w-2xl mx-auto text-sm">Explore our selection of top-rated pickleball equipment</p>
        </div>
        
        <!-- Products Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <ProductCard 
            v-for="product in featuredProducts" 
            :key="product.id"
            :product="product"
          />
        </div>
        
        <div class="text-center mt-6">
          <router-link to="/products" class="btn-primary inline-block">
            View All Products
          </router-link>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-8 bg-secondary/5">
      <div class="container mx-auto px-4">
        <!-- Loading State for About Section -->
        <div v-if="aboutLoading" class="text-center py-16">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p class="mt-4 text-gray-600">Loading about us...</p>
        </div>
        
        <!-- About Content -->
        <div v-else class="flex flex-col md:flex-row items-center gap-6">
          <div class="md:w-1/2">
            <img 
              :src="getImageUrl(aboutData.imageUrl)" 
              alt="About Us" 
              class="rounded-xl shadow-xl w-full h-[250px] md:h-[320px] object-cover"
              @error="handleAboutImageError"
            >
          </div>
          <div class="md:w-1/2">
            <h2 class="text-[clamp(1.5rem,4vw,2rem)] font-bold text-dark mb-4">{{ aboutData.title }}</h2>
            <p v-for="(paragraph, idx) in aboutData.content" :key="idx" class="text-gray-700 mb-3">
              {{ paragraph }}
            </p>
            <div class="grid grid-cols-2 gap-4 mt-4">
              <div v-for="(feature, idx) in aboutData.features" :key="idx" class="flex items-start">
                <div class="text-primary text-xl mr-2">✓</div>
                <div>
                  <h4 class="font-bold mb-0.5">{{ feature.title }}</h4>
                  <p class="text-gray-600 text-sm">{{ feature.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Back to Top Button -->
    <button 
      v-show="showBackToTop"
      @click="scrollToTop"
      class="fixed bottom-6 right-6 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all duration-300 z-40"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
      </svg>
    </button>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Navbar from '../../components/common/Navbar.vue'
import Footer from '../../components/common/Footer.vue'
import ProductCard from '../../components/common/ProductCard.vue'
import { getProductsList, getBanners } from '../../api/products'
import { getSetting } from '../../api/settings'

// Products and Banners data
const products = ref([])
const banners = ref([])
const loading = ref(true)
const error = ref(null)

// About Section loading state - 初始为 true，避免显示默认内容
const aboutLoading = ref(true)

// About Data - 初始为空对象，避免显示默认内容
const aboutData = ref({
  title: '',
  content: [],
  imageUrl: '',
  features: []
})

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return 'https://picsum.photos/seed/about/600/400'
  if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) return imageUrl
  if (imageUrl.startsWith('/')) return imageUrl
  return `/.netlify/functions/get-image?key=${encodeURIComponent(imageUrl)}`
}

// Featured products (show top 3 products, backend already sorts by isFeatured desc)
const featuredProducts = computed(() => {
  return products.value.slice(0, 3)
})

// Banner 轮播相关
const currentBannerIndex = ref(0)
let bannerInterval = null

// 当前显示的 Banner
const activeBanner = computed(() => {
  if (banners.value.length > 0) {
    return banners.value[currentBannerIndex.value]
  }
  return null
})

// 解析折扣标签
const bannerPromoTag = computed(() => {
  if (!activeBanner.value?.subtitle) return null
  const parts = activeBanner.value.subtitle.split('|')
  if (parts.length >= 3) {
    return {
      title: parts[1].trim(),
      discount: parts[2].trim()
    }
  }
  return null
})

// 获取显示的副标题（去掉折扣标签部分）
const bannerSubtitle = computed(() => {
  if (!activeBanner.value?.subtitle) return null
  const parts = activeBanner.value.subtitle.split('|')
  return parts[0].trim()
})

// 切换到下一个 Banner
const nextBanner = () => {
  if (banners.value.length > 1) {
    currentBannerIndex.value = (currentBannerIndex.value + 1) % banners.value.length
  }
}

// 切换到上一个 Banner
const prevBanner = () => {
  if (banners.value.length > 1) {
    currentBannerIndex.value = (currentBannerIndex.value - 1 + banners.value.length) % banners.value.length
  }
}

// 跳转到指定 Banner
const goToBanner = (index) => {
  currentBannerIndex.value = index
  resetBannerInterval()
}

// 重置自动轮播定时器
const resetBannerInterval = () => {
  if (bannerInterval) {
    clearInterval(bannerInterval)
  }
  startBannerInterval()
}

// 启动自动轮播
const startBannerInterval = () => {
  if (banners.value.length > 1) {
    bannerInterval = setInterval(() => {
      nextBanner()
    }, 5000) // 每5秒切换
  }
}

// Load data - 并行加载，优化性能
const loadData = async () => {
  loading.value = true
  error.value = null
  
  try {
    // 并行加载 Products, Banners, 和 Settings
    const [productsRes, bannersRes, aboutRes] = await Promise.all([
      getProductsList('all', 20, 0).catch(() => ({ products: [] })),
      getBanners().catch(() => ({ success: false, data: [] })),
      getSetting('about_us').catch(() => null)
    ])
    
    // 处理 About 数据
    if (aboutRes) {
        let settings = aboutRes
        if (typeof aboutRes === 'string') {
            try {
                settings = JSON.parse(aboutRes)
            } catch (e) {
                settings = {}
            }
        }
        
        // 设置从服务器获取的数据
        aboutData.value = {
          title: settings.title || 'About PickleBall Hub',
          content: Array.isArray(settings.content) && settings.content.length > 0 
            ? settings.content 
            : [
                "PickleBall Hub is your premier destination for high-quality pickleball equipment. We're passionate about the fastest-growing sport in America and committed to providing players of all levels with the best gear to enhance their performance.",
                "Our products undergo rigorous quality testing and are carefully selected to ensure durability, performance, and value. Whether you're a beginner or a seasoned pro, we have everything you need to excel on the court."
              ],
          imageUrl: settings.imageUrl || 'https://picsum.photos/seed/about/600/400',
          features: Array.isArray(settings.features) && settings.features.length > 0 
            ? settings.features 
            : [
                { title: 'Premium Quality', description: 'USAPA approved equipment' },
                { title: 'Expert Selection', description: 'Curated by professionals' },
                { title: 'Fast Shipping', description: 'Quick delivery nationwide' },
                { title: 'Great Service', description: 'Dedicated support team' }
              ]
        }
    } else {
        // 如果没有获取到数据，使用默认值
        aboutData.value = {
          title: 'About PickleBall Hub',
          content: [
            "PickleBall Hub is your premier destination for high-quality pickleball equipment. We're passionate about the fastest-growing sport in America and committed to providing players of all levels with the best gear to enhance their performance.",
            "Our products undergo rigorous quality testing and are carefully selected to ensure durability, performance, and value. Whether you're a beginner or a seasoned pro, we have everything you need to excel on the court."
          ],
          imageUrl: 'https://picsum.photos/seed/about/600/400',
          features: [
            { title: 'Premium Quality', description: 'USAPA approved equipment' },
            { title: 'Expert Selection', description: 'Curated by professionals' },
            { title: 'Fast Shipping', description: 'Quick delivery nationwide' },
            { title: 'Great Service', description: 'Dedicated support team' }
          ]
        }
    }
    
    // About 数据加载完成
    aboutLoading.value = false

    // 处理商品数据
    if (productsRes?.products) {
      products.value = productsRes.products.map(p => ({
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
        image: p.images[0]?.imageUrl || '/placeholder-product.svg', 
        images: p.images.map(img => img.imageUrl || '/placeholder-product.svg'),
        features: p.features || [],
        specifications: p.specifications || {},
        stock: p.stock,
        isFeatured: p.isFeatured,
        isNew: p.isNew
      }))
    }

    // 处理 Banner 数据
    if (bannersRes.success && Array.isArray(bannersRes.data)) {
      banners.value = bannersRes.data
    } else {
      banners.value = []
    }
  } catch (err) {
    error.value = err.message
    console.error('Failed to load data:', err)
  } finally {
    loading.value = false
  }
}

// Back to top button
const showBackToTop = ref(false)

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
  
  // Fade-in animation
  const fadeElements = document.querySelectorAll('.fade-in')
  fadeElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top
    const elementVisible = 150
    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add('opacity-100', 'translate-y-0')
      element.classList.remove('opacity-0', 'translate-y-10')
    }
  })
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const handleImageError = (event) => {
  event.target.src = 'https://picsum.photos/seed/hero/600/400'
}

const handleAboutImageError = (event) => {
  event.target.src = 'https://picsum.photos/seed/about/600/400'
}

onMounted(async () => {
  // 确保页面从顶部开始显示
  window.scrollTo(0, 0)
  
  window.addEventListener('scroll', handleScroll)
  
  // Load products and banners
  await loadData()
  
  // 启动 Banner 自动轮播
  startBannerInterval()
  
  // Trigger initial animation for elements in viewport
  setTimeout(() => {
    handleScroll()
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  // 清理定时器
  if (bannerInterval) {
    clearInterval(bannerInterval)
  }
})
</script>

<style scoped>
.fade-in {
  @apply opacity-0 translate-y-10 transition-all duration-700;
}

.btn-primary {
  @apply bg-primary text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-primary/90 hover:shadow-lg transform hover:-translate-y-0.5;
}

.btn-secondary {
  @apply bg-secondary text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-secondary/90 hover:shadow-lg transform hover:-translate-y-0.5;
}

/* Banner 轮播过渡动画 */
.banner-fade-enter-active,
.banner-fade-leave-active {
  transition: opacity 0.5s ease;
}

.banner-fade-enter-from,
.banner-fade-leave-to {
  opacity: 0;
}
</style>
