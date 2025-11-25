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
                <div class="flex gap-2">
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
                  <button
                    type="button"
                    @click="showCategoryModal = true"
                    class="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 whitespace-nowrap"
                  >
                    + New
                  </button>
                </div>
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

              <!-- Product Images -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Product Images
                </label>
                
                <!-- Upload Button -->
                <div class="flex items-center space-x-4 mb-3">
                  <label class="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500">
                    <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ uploading ? 'Uploading...' : 'Upload Images' }}</span>
                    <input
                      ref="fileInput"
                      type="file"
                      multiple
                      accept="image/*"
                      class="hidden"
                      @change="handleFileSelect"
                      :disabled="uploading"
                    />
                  </label>
                  <span class="text-xs text-gray-500">
                    {{ productImages.length }}/5 images
                  </span>
                </div>

                <!-- Image Previews -->
                <div v-if="productImages.length > 0" class="grid grid-cols-3 gap-3">
                  <div
                    v-for="(img, index) in productImages"
                    :key="index"
                    class="relative group"
                  >
                    <img
                      :src="img.imageUrl"
                      :alt="`Product image ${index + 1}`"
                      class="w-full h-24 object-cover rounded-lg border-2"
                      :class="index === 0 ? 'border-orange-500' : 'border-gray-200'"
                    />
                    <!-- Primary Badge -->
                    <span
                      v-if="index === 0"
                      class="absolute top-1 left-1 px-2 py-0.5 bg-orange-500 text-white text-xs rounded"
                    >
                      Primary
                    </span>
                    <!-- Delete Button -->
                    <button
                      type="button"
                      @click="removeImage(index)"
                      class="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <p class="mt-2 text-xs text-gray-500">
                  Upload up to 5 images. First image will be the primary image. Supported formats: JPG, PNG, WEBP (Max 5MB each)
                </p>
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

    <!-- Create Category Modal -->
    <div v-if="showCategoryModal" class="fixed z-20 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeCategoryModal"></div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="handleCreateCategory">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6">
              <h4 class="text-lg font-medium text-gray-900 mb-4">Create New Category</h4>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Category Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="newCategory.nameEn"
                    type="text"
                    required
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., Paddles"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    URL Slug <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="newCategory.slug"
                    type="text"
                    required
                    pattern="[a-z0-9\-]+"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., paddles"
                  />
                  <p class="mt-1 text-xs text-gray-500">Only lowercase letters, numbers, and hyphens</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    v-model="newCategory.description"
                    rows="2"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Category description..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                :disabled="creatingCategory"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {{ creatingCategory ? 'Creating...' : 'Create Category' }}
              </button>
              <button
                type="button"
                @click="closeCategoryModal"
                :disabled="creatingCategory"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { createCategory } from '@/api/admin'

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

const emit = defineEmits(['close', 'submit', 'category-created'])

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
const productImages = ref([])
const uploading = ref(false)
const fileInput = ref(null)

// 创建分类相关
const showCategoryModal = ref(false)
const creatingCategory = ref(false)
const newCategory = ref({
  nameEn: '',
  slug: '',
  description: ''
})

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
    
    // 获取商品图片
    if (product.images && product.images.length > 0) {
      productImages.value = product.images.map(img => ({
        imageUrl: img.imageUrl,
        altText: img.altText || product.nameEn
      }))
    } else {
      productImages.value = []
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
    productImages.value = []
  }
}, { immediate: true })

// 处理文件选择
const handleFileSelect = async (event) => {
  const files = Array.from(event.target.files)
  
  if (files.length === 0) return
  
  // 检查图片数量限制
  if (productImages.value.length + files.length > 5) {
    alert('You can only upload up to 5 images')
    return
  }
  
  // 检查文件大小和类型
  for (const file of files) {
    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert(`File "${file.name}" is too large. Maximum size is 5MB`)
      return
    }
    if (!file.type.startsWith('image/')) {
      alert(`File "${file.name}" is not a valid image`)
      return
    }
  }
  
  uploading.value = true
  
  try {
    // 上传每个文件
    for (const file of files) {
      const base64 = await fileToBase64(file)
      
      // 调用上传接口
      const response = await uploadImage({
        image: base64,
        fileName: file.name,
        mimeType: file.type
      })
      
      if (response.success) {
        productImages.value.push({
          imageUrl: response.data.imageUrl,
          altText: form.value.nameEn || 'Product image'
        })
      } else {
        alert(`Failed to upload ${file.name}: ${response.error}`)
      }
    }
  } catch (error) {
    console.error('Upload error:', error)
    alert('Failed to upload images')
  } finally {
    uploading.value = false
    // 清空文件输入
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

// 文件转 Base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// 上传图片到服务器
const uploadImage = async (imageData) => {
  try {
    const token = localStorage.getItem('admin_token')
    const response = await fetch('/.netlify/functions/upload-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(imageData)
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// 删除图片
const removeImage = (index) => {
  productImages.value.splice(index, 1)
}

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

  // 添加图片数据
  if (productImages.value.length > 0) {
    submitData.images = productImages.value
  }

  emit('submit', submitData)
}

const closeCategoryModal = () => {
  showCategoryModal.value = false
  newCategory.value = {
    nameEn: '',
    slug: '',
    description: ''
  }
}

const handleCreateCategory = async () => {
  creatingCategory.value = true
  
  try {
    const response = await createCategory(newCategory.value)
    
    if (response.success) {
      alert('Category created successfully!')
      // 通知父组件刷新分类列表
      emit('category-created', response.data)
      // 自动选择新创建的分类
      form.value.categoryId = response.data.id
      closeCategoryModal()
    } else {
      alert('Failed to create category: ' + response.error)
    }
  } catch (error) {
    console.error('Failed to create category:', error)
    alert('Failed to create category')
  } finally {
    creatingCategory.value = false
  }
}
</script>

