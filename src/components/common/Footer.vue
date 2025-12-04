<template>
  <footer class="bg-dark text-white py-12">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Brand -->
        <div>
          <div class="flex items-center space-x-4 mb-6">
            <div class="bg-white rounded-lg p-2.5 flex items-center justify-center">
              <img 
                src="/logn.jpg" 
                alt="KAPO Logo" 
                class="w-auto object-contain"
                style="height: 4.5rem; min-height: 54px;"
                loading="lazy"
              />
            </div>
            <span class="text-xl font-bold bg-white px-3 py-1 rounded" style="color: #012D74;">PickleBall Hub</span>
          </div>
          <p class="text-gray-400 mb-6">
            Professional pickleball equipment supplier for players of all levels across North America and beyond.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-primary transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-primary transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-primary transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
          </div>
        </div>
        
        <!-- Quick Links -->
        <div>
          <h4 class="text-lg font-bold mb-6">Quick Links</h4>
          <ul class="space-y-3">
            <li><router-link to="/" class="text-gray-400 hover:text-primary transition-colors">Home</router-link></li>
            <li><router-link to="/products" class="text-gray-400 hover:text-primary transition-colors">Products</router-link></li>
            <li><a href="#about" class="text-gray-400 hover:text-primary transition-colors">About Us</a></li>
            <li><a href="#contact" class="text-gray-400 hover:text-primary transition-colors">Contact</a></li>
          </ul>
        </div>
        
        <!-- Categories -->
        <div>
          <h4 class="text-lg font-bold mb-6">Categories</h4>
          <ul class="space-y-3">
            <li><router-link to="/products?category=paddles" class="text-gray-400 hover:text-primary transition-colors">Paddle</router-link></li>
            <li><router-link to="/products?category=balls" class="text-gray-400 hover:text-primary transition-colors">Pickleball</router-link></li>
            <li><router-link to="/products?category=bags-accessories" class="text-gray-400 hover:text-primary transition-colors">Bags & Accessories</router-link></li>
            <li><router-link to="/products?category=training-equipment" class="text-gray-400 hover:text-primary transition-colors">Training Equipment</router-link></li>
            <li><router-link to="/products?category=nets-courts" class="text-gray-400 hover:text-primary transition-colors">Nets & Courts</router-link></li>
          </ul>
        </div>
        
        <!-- Contact Info -->
        <div>
          <h4 class="text-lg font-bold mb-6">Contact Us</h4>
          <div class="space-y-4">
            <!-- WhatsApp -->
            <a 
              href="https://wa.me/8615507759316" 
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center space-x-3 text-gray-400 hover:text-green-400 transition-colors group"
            >
              <div class="flex-shrink-0 w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-white">WhatsApp</p>
                <p class="text-sm">+86 155 0775 9316</p>
              </div>
            </a>
            
            <!-- Address -->
            <div class="flex items-start space-x-3 text-gray-400">
              <div class="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-white mb-1">Address</p>
                <p class="text-sm leading-relaxed">
                  Lingshow Q3, Fengze District,<br>
                  Quanzhou City,<br>
                  Fujian Province, China
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="border-t border-gray-800 mt-12 pt-8">
        <!-- Contact Info Bar -->
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div class="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <a 
              href="https://wa.me/8615507759316" 
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span class="text-sm">+86 155 0775 9316</span>
            </a>
            <div class="hidden md:block w-px h-4 bg-gray-700"></div>
            <div class="flex items-center space-x-2 text-gray-400 text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span>Quanzhou, Fujian, China</span>
            </div>
          </div>
          <div class="flex flex-wrap justify-center gap-4 md:gap-6">
            <a href="#" class="text-gray-400 hover:text-primary text-sm transition-colors">Privacy Policy</a>
            <a href="#" class="text-gray-400 hover:text-primary text-sm transition-colors">Terms of Service</a>
            <a href="#" class="text-gray-400 hover:text-primary text-sm transition-colors">Return Policy</a>
          </div>
        </div>
        
        <!-- Copyright -->
        <div class="text-center">
          <p class="text-gray-400 text-sm">
            © 2024 PickleBall Hub. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Footer component
</script>

