<template>
  <div class="min-h-screen bg-light">
    <Navbar />
    
    <!-- Hero Section -->
    <section class="pt-24 md:pt-32 pb-16 md:pb-24 bg-gradient-to-br from-primary/10 via-white to-secondary/10">
      <div class="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div class="md:w-1/2 fade-in">
          <template v-if="activeBanner">
            <h1 class="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight text-dark mb-4">
              {{ activeBanner.title }}<br>
              <span class="text-primary" v-if="activeBanner.subtitle">{{ activeBanner.subtitle }}</span>
            </h1>
            <p class="text-lg md:text-xl text-gray-700 mb-8 max-w-lg">
              Discover professional-grade pickleball paddles, balls, and accessories designed for players of all skill levels.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
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
            <p class="text-lg md:text-xl text-gray-700 mb-8 max-w-lg">
              Discover professional-grade pickleball paddles, balls, and accessories designed for players of all skill levels.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <router-link to="/products" class="btn-primary text-center">
                Shop Now
              </router-link>
              <a href="#about" class="btn-secondary text-center">
                Learn More
              </a>
            </div>
          </template>
        </div>
        
        <div class="md:w-1/2 mt-12 md:mt-0 fade-in" style="transition-delay: 0.2s;">
          <div class="relative">
            <img 
              :src="activeBanner ? activeBanner.imageUrl : 'https://picsum.photos/seed/hero/600/400'" 
              alt="Pickleball Equipment" 
              class="rounded-xl shadow-2xl w-full object-cover h-[300px] md:h-[400px]"
            >
            <div class="absolute -bottom-6 -left-6 bg-accent text-dark p-4 rounded-lg shadow-lg transform rotate-3">
              <p class="font-bold text-lg">Special Offer</p>
              <p class="text-sm">Up to 20% OFF</p>
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
            class="fade-in"
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
            <img src="https://picsum.photos/seed/about/600/400" alt="About Us" class="rounded-xl shadow-xl w-full h-[300px] md:h-[400px] object-cover">
          </div>
          <div class="md:w-1/2 fade-in" style="transition-delay: 0.2s;">
            <h2 class="text-[clamp(1.8rem,4vw,2.5rem)] font-bold text-dark mb-6">About PickleBall Hub</h2>
            <p class="text-gray-700 text-lg mb-4">
              PickleBall Hub is your premier destination for high-quality pickleball equipment. We're passionate about the fastest-growing sport in America and committed to providing players of all levels with the best gear to enhance their performance.
            </p>
            <p class="text-gray-700 text-lg mb-6">
              Our products undergo rigorous quality testing and are carefully selected to ensure durability, performance, and value. Whether you're a beginner or a seasoned pro, we have everything you need to excel on the court.
            </p>
            <div class="grid grid-cols-2 gap-6 mb-8">
              <div class="flex items-start">
                <div class="text-primary text-2xl mr-3">✓</div>
                <div>
                  <h4 class="font-bold text-lg mb-1">Premium Quality</h4>
                  <p class="text-gray-600">USAPA approved equipment</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="text-primary text-2xl mr-3">✓</div>
                <div>
                  <h4 class="font-bold text-lg mb-1">Expert Selection</h4>
                  <p class="text-gray-600">Curated by professionals</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="text-primary text-2xl mr-3">✓</div>
                <div>
                  <h4 class="font-bold text-lg mb-1">Fast Shipping</h4>
                  <p class="text-gray-600">Quick delivery nationwide</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="text-primary text-2xl mr-3">✓</div>
                <div>
                  <h4 class="font-bold text-lg mb-1">Great Service</h4>
                  <p class="text-gray-600">Dedicated support team</p>
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

// Featured products (only show products with isFeatured: true)
const featuredProducts = computed(() => {
  return products.value.filter(p => p.isFeatured).slice(0, 3)
})

// Active Banners
const activeBanner = computed(() => {
  if (banners.value.length > 0) {
    return banners.value[0] // 暂时只显示第一个 Banner，后续可以做轮播
  }
  return null
})

// Load data
const loadData = async () => {
  loading.value = true
  error.value = null
  try {
    // Load Products
    const productsRes = await getProductsList('all', 100, 0)
    products.value = productsRes.products.map(p => ({
      id: p.id,
      name: p.nameEn,
      slug: p.slug,
      category: p.category.slug,
      description: p.description,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
      rating: Number(p.rating),
      reviewCount: p.reviewCount,
      badge: p.isFeatured ? 'Best Seller' : (p.isNew ? 'New' : null),
      image: p.images[0]?.imageUrl || '/placeholder-product.svg',
      images: p.images.map(img => img.imageUrl),
      features: p.features || [],
      specifications: p.specifications || {},
      stock: p.stock,
      isFeatured: p.isFeatured,
      isNew: p.isNew
    }))

    // Load Banners
    const bannersRes = await getBanners()
    if (bannersRes.success) {
      banners.value = bannersRes.data
    }
  } catch (err) {
    error.value = err.message
    console.error('加载数据失败:', err)
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

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  // Trigger initial animation
  handleScroll()
  // Load products and banners
  await loadData()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
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
</style>

