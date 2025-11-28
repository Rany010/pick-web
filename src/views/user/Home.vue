<template>
  <div class="min-h-screen bg-light">
    <Navbar />
    
    <!-- Hero Section with Banner Carousel -->
    <section class="pt-24 md:pt-32 pb-16 md:pb-24 bg-gradient-to-br from-primary/10 via-white to-secondary/10">
      <div class="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div class="md:w-1/2">
          
          <template v-if="activeBanner">
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
              <transition name="banner-fade" mode="out-in">
                <img 
                  :key="currentBannerIndex"
                  :src="activeBanner?.imageUrl || 'https://picsum.photos/seed/hero/600/400'" 
                  alt="Pickleball Equipment" 
                  class="w-full object-cover h-[300px] md:h-[400px]"
                  @error="handleImageError"
                  @load="handleImageLoad"
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
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16 fade-in">
          <h2 class="text-[clamp(1.8rem,4vw,2.5rem)] font-bold text-dark mb-4">Featured Products</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">Explore our selection of top-rated pickleball equipment</p>
        </div>
        
        <!-- Products Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProductCard 
            v-for="product in featuredProducts" 
            :key="product.id"
            :product="product"
          />
        </div>
        
        <div class="text-center mt-12">
          <router-link to="/products" class="btn-primary inline-block">
            View All Products
          </router-link>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-16 bg-secondary/5">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center gap-12">
          <div class="md:w-1/2 fade-in">
            <img :src="getImageUrl(aboutData.imageUrl)" alt="About Us" class="rounded-xl shadow-xl w-full h-[300px] md:h-[400px] object-cover">
          </div>
          <div class="md:w-1/2 fade-in" style="transition-delay: 0.2s;">
            <h2 class="text-[clamp(1.8rem,4vw,2.5rem)] font-bold text-dark mb-6">{{ aboutData.title }}</h2>
            <p v-for="(paragraph, idx) in aboutData.content" :key="idx" class="text-gray-700 text-lg mb-4">
              {{ paragraph }}
            </p>
            <div class="grid grid-cols-2 gap-6 mb-8 mt-6">
              <div v-for="(feature, idx) in aboutData.features" :key="idx" class="flex items-start">
                <div class="text-primary text-2xl mr-3">✓</div>
                <div>
                  <h4 class="font-bold text-lg mb-1">{{ feature.title }}</h4>
                  <p class="text-gray-600">{{ feature.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16 fade-in">
          <h2 class="text-[clamp(1.8rem,4vw,2.5rem)] font-bold text-dark mb-4">Contact Us</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">Have questions? We're here to help!</p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <!-- Contact Form -->
          <div class="bg-white rounded-xl shadow-lg p-8 fade-in">
            <h3 class="text-2xl font-bold mb-6">Send us a message</h3>
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Name</label>
                  <input 
                    v-model="form.name"
                    type="text" 
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors" 
                    placeholder="Your name"
                    required
                  >
                </div>
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Email</label>
                  <input 
                    v-model="form.email"
                    type="email" 
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors" 
                    placeholder="Your email"
                    required
                  >
                </div>
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">Phone</label>
                <input 
                  v-model="form.phone"
                  type="tel" 
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors" 
                  placeholder="Your phone"
                >
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">Product Interest</label>
                <select 
                  v-model="form.product"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                >
                  <option value="">Select a product type</option>
                  <option value="paddles">Paddles</option>
                  <option value="balls">Balls</option>
                  <option value="accessories">Accessories</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">Message</label>
                <textarea 
                  v-model="form.message"
                  rows="4" 
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors" 
                  placeholder="Your message"
                  required
                ></textarea>
              </div>
              <button type="submit" class="btn-primary w-full">
                Send Message
              </button>
            </form>
          </div>
          
          <!-- Contact Info -->
          <div class="flex flex-col justify-between fade-in" style="transition-delay: 0.2s;">
            <div>
              <h3 class="text-2xl font-bold mb-6">Get in Touch</h3>
              <div class="space-y-6">
                <div class="flex items-start">
                  <div class="bg-primary/10 rounded-full p-3 mr-4">
                    <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-bold text-lg mb-1">Address</h4>
                    <p class="text-gray-600">123 Pickleball Lane<br>Sports City, SC 12345</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="bg-primary/10 rounded-full p-3 mr-4">
                    <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-bold text-lg mb-1">Phone</h4>
                    <p class="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="bg-primary/10 rounded-full p-3 mr-4">
                    <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-bold text-lg mb-1">Email</h4>
                    <p class="text-gray-600">info@pickleballhub.com</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="bg-primary/10 rounded-full p-3 mr-4">
                    <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-bold text-lg mb-1">Business Hours</h4>
                    <p class="text-gray-600">Mon-Fri: 9:00 AM - 6:00 PM<br>Sat: 10:00 AM - 4:00 PM<br>Sun: Closed</p>
                  </div>
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

// Form data
const form = ref({
  name: '',
  email: '',
  phone: '',
  product: '',
  message: ''
})

// Products and Banners data
const products = ref([])
const banners = ref([])
const loading = ref(false)
const error = ref(null)

// About Data - with default fallback
const aboutData = ref({
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
  const startTime = Date.now()
  console.log('🚀 [Home] 开始加载数据...')
  
  try {
    // 并行加载 Products, Banners, 和 Settings
    const [productsRes, bannersRes, aboutRes] = await Promise.all([
      getProductsList('all', 20, 0).catch(err => {
        console.error('❌ [Home] 加载商品失败:', err)
        return { products: [] }
      }),
      getBanners().catch(err => {
        console.error('❌ [Home] 加载 Banner 失败:', err)
        return { success: false, data: [] }
      }),
      getSetting('about_us').catch(err => {
        console.error('❌ [Home] 加载 About 设置失败:', err)
        return null
      })
    ])
    
    // 处理 About 数据
    console.log('📝 [Home] About API 原始响应:', aboutRes)
    console.log('📝 [Home] About API 响应类型:', typeof aboutRes)
    
    if (aboutRes) {
        let settings = aboutRes
        if (typeof aboutRes === 'string') {
            console.log('📝 [Home] About 数据是字符串，尝试解析 JSON...')
            try {
                settings = JSON.parse(aboutRes)
                console.log('📝 [Home] JSON 解析成功:', settings)
            } catch (e) {
                console.error('❌ [Home] JSON 解析失败:', e)
                settings = {}
            }
        }
        
        console.log('📝 [Home] 处理后的 settings:', settings)
        console.log('📝 [Home] settings.title:', settings.title)
        console.log('📝 [Home] settings.content:', settings.content)
        console.log('📝 [Home] settings.imageUrl:', settings.imageUrl)
        console.log('📝 [Home] settings.features:', settings.features)
        
        // 只有当数据非空时才覆盖默认值
        if (settings.title) aboutData.value.title = settings.title
        // content 和 features 需要检查数组是否有内容
        if (Array.isArray(settings.content) && settings.content.length > 0) {
          aboutData.value.content = settings.content
        }
        if (settings.imageUrl) aboutData.value.imageUrl = settings.imageUrl
        if (Array.isArray(settings.features) && settings.features.length > 0) {
          aboutData.value.features = settings.features
        }
        
        console.log('✅ [Home] 更新后的 aboutData:', JSON.stringify(aboutData.value, null, 2))
    } else {
        console.warn('⚠️ [Home] About API 返回空值，使用默认数据')
    }

    console.log(`📦 [Home] 商品API响应:`, productsRes)
    console.log(`🖼️ [Home] Banner API响应:`, bannersRes)
  
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
      } else {
        console.warn('⚠️ [Home] API响应中未找到 products 字段:', productsRes)
      }

    // 处理 Banner 数据
    if (bannersRes.success && Array.isArray(bannersRes.data)) {
      banners.value = bannersRes.data
    } else {
      banners.value = []
    }
  } catch (err) {
    error.value = err.message
    console.error('❌ [Home] 加载数据失败:', err)
  } finally {
    loading.value = false
    console.log(`⏱️ [Home] 数据加载完成，耗时: ${Date.now() - startTime}ms`)
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

const handleSubmit = () => {
  alert('Thank you for your message! We will contact you soon.')
  form.value = {
    name: '',
    email: '',
    phone: '',
    product: '',
    message: ''
  }
}

const handleImageError = (event) => {
  console.error('🖼️ Banner 图片加载失败:', event.target.src)
  event.target.src = 'https://picsum.photos/seed/hero/600/400'
}

const handleImageLoad = (event) => {
  console.log('🖼️ Banner 图片加载成功')
}

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  
  // Load products and banners
  await loadData()
  
  // 启动 Banner 自动轮播
  startBannerInterval()
  
  // Trigger initial animation
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
