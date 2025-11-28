<template>
  <header 
    :class="['fixed w-full top-0 z-50 transition-all duration-300', scrolled ? 'bg-white/95 shadow-md py-2' : 'bg-white/95 shadow-sm py-3']"
  >
    <div class="container mx-auto px-4 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center space-x-2">
        <span class="text-2xl">🏓</span>
        <span class="text-xl font-bold text-primary">PickleBall Hub</span>
      </router-link>
      
      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center space-x-8">
        <router-link to="/" class="font-medium hover:text-primary transition-colors">Home</router-link>
        <router-link to="/products" class="font-medium hover:text-primary transition-colors">Products</router-link>
        <a href="#about" class="font-medium hover:text-primary transition-colors">About</a>
      </nav>
      
      <!-- Mobile Menu Button -->
      <button 
        @click="mobileMenuOpen = !mobileMenuOpen"
        class="md:hidden text-dark text-xl"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 -translate-y-full"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-full"
    >
      <div v-show="mobileMenuOpen" class="md:hidden bg-white shadow-lg">
        <div class="container mx-auto px-4 py-3 flex flex-col space-y-4">
          <router-link to="/" class="font-medium hover:text-primary transition-colors py-2 border-b border-gray-100" @click="mobileMenuOpen = false">Home</router-link>
          <router-link to="/products" class="font-medium hover:text-primary transition-colors py-2 border-b border-gray-100" @click="mobileMenuOpen = false">Products</router-link>
          <a href="#about" class="font-medium hover:text-primary transition-colors py-2" @click="mobileMenuOpen = false">About</a>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const scrolled = ref(false)
const mobileMenuOpen = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

