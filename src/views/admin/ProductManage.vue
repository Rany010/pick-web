<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Product Management</h2>
          <p class="mt-1 text-sm text-gray-600">Manage your pickleball products</p>
        </div>
        <button
          @click="openCreateModal"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
        >
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white shadow rounded-lg p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              v-model="filters.category"
              @change="loadProducts"
              class="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">All Categories</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.slug">
                {{ cat.nameEn }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              v-model="filters.status"
              @change="loadProducts"
              class="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              v-model="filters.search"
              @input="debounceSearch"
              type="text"
              placeholder="Search products..."
              class="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p class="mt-4 text-gray-600">Loading products...</p>
        </div>

        <div v-else-if="products.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No products</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
        </div>

        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-12 w-12">
                    <img
                      class="h-12 w-12 rounded-lg object-cover"
                      :src="product.images[0]?.imageUrl || '/placeholder-product.svg'"
                      :alt="product.nameEn"
                    />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ product.nameEn }}</div>
                    <div class="text-sm text-gray-500">{{ product.slug }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ product.category?.nameEn }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${{ product.price }}</div>
                <div v-if="product.originalPrice" class="text-sm text-gray-500 line-through">
                  ${{ product.originalPrice }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ product.stock }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': product.status === 'active',
                    'bg-yellow-100 text-yellow-800': product.status === 'draft',
                    'bg-gray-100 text-gray-800': product.status === 'inactive'
                  }"
                >
                  {{ product.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editProduct(product)"
                  class="text-orange-600 hover:text-orange-900 mr-3 transition-colors"
                >
                  Edit
                </button>
                <button
                  @click="deleteProduct(product)"
                  class="text-red-600 hover:text-red-900 transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalProducts > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="prevPage"
            :disabled="filters.offset === 0"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="filters.offset + filters.limit >= totalProducts"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">{{ filters.offset + 1 }}</span> to
              <span class="font-medium">{{ Math.min(filters.offset + filters.limit, totalProducts) }}</span> of
              <span class="font-medium">{{ totalProducts }}</span> results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                @click="prevPage"
                :disabled="filters.offset === 0"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                @click="nextPage"
                :disabled="filters.offset + filters.limit >= totalProducts"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Form Modal -->
    <ProductForm
      v-if="showModal"
      :product="editingProduct"
      :categories="categories"
      :loading="submitting"
      @close="closeModal"
      @submit="handleSubmit"
      @category-created="handleCategoryCreated"
    />
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import ProductForm from '@/components/admin/ProductForm.vue'
import { getProducts, getCategories, deleteProductById, createProduct, updateProduct } from '@/api/admin'

const router = useRouter()

const products = ref([])
const categories = ref([])
const loading = ref(false)
const submitting = ref(false)
const totalProducts = ref(0)
const showModal = ref(false)
const editingProduct = ref(null)

const filters = ref({
  category: '',
  status: '',
  search: '',
  limit: 20,
  offset: 0
})

let searchTimeout = null

onMounted(async () => {
  // 检查登录状态
  const token = localStorage.getItem('admin_token')
  if (!token) {
    router.push('/admin/login')
    return
  }

  await loadCategories()
  await loadProducts()
})

const loadCategories = async () => {
  try {
    const response = await getCategories()
    if (response.success) {
      categories.value = response.data
    }
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

const loadProducts = async () => {
  loading.value = true
  try {
    const response = await getProducts(filters.value)
    if (response.success) {
      products.value = response.data.products
      totalProducts.value = response.data.total
    }
  } catch (error) {
    console.error('Failed to load products:', error)
    alert('Failed to load products')
  } finally {
    loading.value = false
  }
}

const debounceSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadProducts()
  }, 500)
}

const prevPage = () => {
  if (filters.value.offset > 0) {
    filters.value.offset -= filters.value.limit
    loadProducts()
  }
}

const nextPage = () => {
  if (filters.value.offset + filters.value.limit < totalProducts.value) {
    filters.value.offset += filters.value.limit
    loadProducts()
  }
}

const openCreateModal = () => {
  editingProduct.value = null
  showModal.value = true
}

const editProduct = (product) => {
  editingProduct.value = product
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingProduct.value = null
}

const deleteProduct = async (product) => {
  if (!confirm(`Are you sure you want to delete "${product.nameEn}"?`)) {
    return
  }

  try {
    const response = await deleteProductById(product.id)
    if (response.success) {
      alert('Product deleted successfully')
      await loadProducts()
    } else {
      alert('Failed to delete product: ' + response.error)
    }
  } catch (error) {
    console.error('Failed to delete product:', error)
    alert('Failed to delete product')
  }
}

const handleSubmit = async (productData) => {
  submitting.value = true
  
  try {
    let response
    if (editingProduct.value) {
      // 更新商品
      response = await updateProduct(editingProduct.value.id, productData)
    } else {
      // 创建新商品
      response = await createProduct(productData)
    }

    if (response.success) {
      alert(editingProduct.value ? 'Product updated successfully!' : 'Product created successfully!')
      closeModal()
      await loadProducts()
    } else {
      alert('Failed to save product: ' + response.error)
    }
  } catch (error) {
    console.error('Failed to save product:', error)
    alert('Failed to save product')
  } finally {
    submitting.value = false
  }
}

const handleCategoryCreated = (newCategory) => {
  // 将新分类添加到列表中
  categories.value.push(newCategory)
}
</script>

