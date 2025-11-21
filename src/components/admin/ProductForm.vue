<template>
  <div class="fixed z-10 inset-0 overflow-y-auto" @click.self="$emit('close')">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
        <form @submit.prevent="handleSubmit">
          <!-- Header -->
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                {{ isEdit ? 'Edit Product' : 'Add New Product' }}
              </h3>
              <button type="button" @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Form Fields -->
            <div class="space-y-4 max-h-96 overflow-y-auto pr-2">
              <!-- Product Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.nameEn"
                  type="text"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., Carbon Fiber Pickleball Paddle"
                />
              </div>

              <!-- Slug -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  URL Slug <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.slug"
                  type="text"
                  required
                  pattern="[a-z0-9\-]+"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., carbon-fiber-paddle"
                />
                <p class="mt-1 text-xs text-gray-500">Only lowercase letters, numbers, and hyphens</p>
              </div>

              <!-- Category -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Category <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.categoryId"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select a category</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.nameEn }}
                  </option>
                </select>
              </div>

              <!-- Price -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Price (USD) <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model.number="form.price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    placeholder="99.99"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Original Price (USD)
                  </label>
                  <input
                    v-model.number="form.originalPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    placeholder="149.99"
                  />
                </div>
              </div>

              <!-- Stock -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity
                </label>
                <input
                  v-model.number="form.stock"
                  type="number"
                  min="0"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  placeholder="100"
                />
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Product description..."
                ></textarea>
              </div>

              <!-- Features (JSON) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Features (one per line)
                </label>
                <textarea
                  v-model="featuresText"
                  rows="3"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  placeholder="High-quality carbon fiber&#10;Lightweight design&#10;Professional grade"
                ></textarea>
                <p class="mt-1 text-xs text-gray-500">Enter each feature on a new line</p>
              </div>

              <!-- Image URL -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  v-model="imageUrl"
                  type="url"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  placeholder="https://example.com/image.jpg"
                />
                <p class="mt-1 text-xs text-gray-500">Enter image URL (placeholder images will be used if empty)</p>
              </div>

              <!-- Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  v-model="form.status"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <!-- Flags -->
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input
                    v-model="form.isFeatured"
                    type="checkbox"
                    class="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">Featured Product</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="form.isNew"
                    type="checkbox"
                    class="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">New Product</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              :disabled="loading"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading">{{ isEdit ? 'Updating...' : 'Creating...' }}</span>
              <span v-else>{{ isEdit ? 'Update Product' : 'Create Product' }}</span>
            </button>
            <button
              type="button"
              @click="$emit('close')"
              :disabled="loading"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    default: null
  },
  categories: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])

const isEdit = computed(() => !!props.product)

const form = ref({
  nameEn: '',
  slug: '',
  categoryId: '',
  price: '',
  originalPrice: '',
  stock: 0,
  description: '',
  features: null,
  status: 'draft',
  isFeatured: false,
  isNew: false
})

const featuresText = ref('')
const imageUrl = ref('')

// 如果是编辑模式，填充表单
watch(() => props.product, (product) => {
  if (product) {
    form.value = {
      nameEn: product.nameEn || '',
      slug: product.slug || '',
      categoryId: product.categoryId || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      stock: product.stock || 0,
      description: product.description || '',
      features: product.features || null,
      status: product.status || 'draft',
      isFeatured: product.isFeatured || false,
      isNew: product.isNew || false
    }
    
    // 转换 features JSON 为文本
    if (product.features && Array.isArray(product.features)) {
      featuresText.value = product.features.join('\n')
    }
    
    // 获取主图
    if (product.images && product.images.length > 0) {
      imageUrl.value = product.images[0].imageUrl
    }
  } else {
    // 重置表单
    form.value = {
      nameEn: '',
      slug: '',
      categoryId: '',
      price: '',
      originalPrice: '',
      stock: 0,
      description: '',
      features: null,
      status: 'draft',
      isFeatured: false,
      isNew: false
    }
    featuresText.value = ''
    imageUrl.value = ''
  }
}, { immediate: true })

const handleSubmit = () => {
  // 处理 features
  if (featuresText.value.trim()) {
    form.value.features = featuresText.value.split('\n').filter(f => f.trim())
  } else {
    form.value.features = null
  }

  // 构建提交数据
  const submitData = {
    ...form.value,
    categoryId: parseInt(form.value.categoryId),
    price: parseFloat(form.value.price),
    originalPrice: form.value.originalPrice ? parseFloat(form.value.originalPrice) : null
  }

  // 如果是编辑模式，添加 ID
  if (isEdit.value) {
    submitData.id = props.product.id
  }

  // 如果有图片 URL，添加图片数据
  if (imageUrl.value) {
    submitData.images = [{
      imageUrl: imageUrl.value,
      altText: form.value.nameEn
    }]
  }

  emit('submit', submitData)
}
</script>

