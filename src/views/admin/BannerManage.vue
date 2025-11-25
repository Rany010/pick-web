<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Banner Management</h1>
      <button
        @click="openModal()"
        class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        + Add New Banner
      </button>
    </div>

    <!-- Banner List -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul role="list" class="divide-y divide-gray-200">
        <li v-for="banner in banners" :key="banner.id" class="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
          <div class="flex items-center justify-between">
            <div class="flex items-center flex-1 min-w-0">
              <div class="flex-shrink-0 h-24 w-40 relative rounded overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  v-if="banner.imageUrl"
                  :src="banner.imageUrl"
                  :alt="banner.title"
                  class="h-full w-full object-cover"
                />
                <div v-else class="flex items-center justify-center h-full text-gray-400">
                  No Image
                </div>
              </div>
              <div class="ml-4 flex-1">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-medium text-orange-600 truncate">{{ banner.title }}</h3>
                  <div class="ml-2 flex-shrink-0 flex">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="banner.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ banner.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                </div>
                <div class="mt-2 flex justify-between">
                  <div class="sm:flex">
                    <p class="flex items-center text-sm text-gray-500">
                      Order: {{ banner.sortOrder }}
                    </p>
                    <p v-if="banner.linkUrl" class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6 truncate max-w-xs">
                      Link: {{ banner.linkUrl }}
                    </p>
                  </div>
                  <div class="flex items-center space-x-4 text-sm">
                    <button
                      @click="openModal(banner)"
                      class="font-medium text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      @click="handleDelete(banner)"
                      class="font-medium text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
        <li v-if="banners.length === 0" class="px-4 py-12 text-center text-gray-500">
          No banners found. Create one to get started.
        </li>
      </ul>
    </div>

    <!-- Banner Modal -->
    <div v-if="showModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="handleSubmit">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                {{ isEdit ? 'Edit Banner' : 'Add New Banner' }}
              </h3>
              
              <div class="space-y-4">
                <!-- Title -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Title <span class="text-red-500">*</span></label>
                  <input
                    v-model="form.title"
                    type="text"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="e.g., Summer Sale"
                  />
                </div>

                <!-- Subtitle -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Subtitle</label>
                  <input
                    v-model="form.subtitle"
                    type="text"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Up to 50% off"
                  />
                </div>

                <!-- Image Upload -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Banner Image <span class="text-red-500">*</span></label>
                  
                  <div v-if="form.imageUrl" class="mb-3 relative group">
                    <img :src="form.imageUrl" class="w-full h-32 object-cover rounded-lg border border-gray-200" />
                    <button 
                      type="button"
                      @click="form.imageUrl = ''"
                      class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  <div v-else class="flex items-center justify-center w-full">
                    <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div class="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg class="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p class="mb-2 text-sm text-gray-500"><span class="font-semibold">Click to upload</span></p>
                        <p class="text-xs text-gray-500">SVG, PNG, JPG or WEBP (MAX. 5MB)</p>
                      </div>
                      <input type="file" class="hidden" accept="image/*" @change="handleImageUpload" :disabled="uploading" />
                    </label>
                  </div>
                  <p v-if="uploading" class="mt-2 text-sm text-orange-600">Uploading image...</p>
                </div>

                <!-- Link URL -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Link URL</label>
                  <input
                    v-model="form.linkUrl"
                    type="text"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="/products/category/paddles"
                  />
                </div>

                <!-- Button Text -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Button Text</label>
                  <input
                    v-model="form.buttonText"
                    type="text"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Shop Now"
                  />
                </div>

                <div class="flex space-x-4">
                  <!-- Sort Order -->
                  <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700">Sort Order</label>
                    <input
                      v-model.number="form.sortOrder"
                      type="number"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    />
                  </div>
                  
                  <!-- Status -->
                  <div class="flex-1 flex items-center pt-6">
                    <label class="flex items-center space-x-2 cursor-pointer">
                      <input
                        v-model="form.isActive"
                        type="checkbox"
                        class="rounded border-gray-300 text-orange-600 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                      />
                      <span class="text-sm font-medium text-gray-700">Active</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                :disabled="loading || uploading"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {{ loading ? 'Saving...' : 'Save' }}
              </button>
              <button
                type="button"
                @click="closeModal"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
import { ref, onMounted, computed } from 'vue'
import { getBanners, createBanner, updateBanner, deleteBanner, uploadImage } from '@/api/admin'

const banners = ref([])
const showModal = ref(false)
const loading = ref(false)
const uploading = ref(false)
const editingId = ref(null)

const isEdit = computed(() => !!editingId.value)

const form = ref({
  title: '',
  subtitle: '',
  imageUrl: '',
  linkUrl: '',
  buttonText: '',
  sortOrder: 0,
  isActive: true
})

const fetchBanners = async () => {
  try {
    const response = await getBanners()
    if (response.success) {
      banners.value = response.data
    }
  } catch (error) {
    console.error('Failed to load banners:', error)
  }
}

const openModal = (banner = null) => {
  if (banner) {
    editingId.value = banner.id
    form.value = {
      title: banner.title,
      subtitle: banner.subtitle || '',
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || '',
      buttonText: banner.buttonText || '',
      sortOrder: banner.sortOrder || 0,
      isActive: banner.isActive
    }
  } else {
    editingId.value = null
    form.value = {
      title: '',
      subtitle: '',
      imageUrl: '',
      linkUrl: '',
      buttonText: '',
      sortOrder: 0,
      isActive: true
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingId.value = null
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    alert('File size must be less than 5MB')
    return
  }

  uploading.value = true
  try {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target.result
      const response = await uploadImage({
        image: base64,
        fileName: file.name,
        mimeType: file.type
      })

      if (response.success) {
        form.value.imageUrl = response.data.imageUrl
      } else {
        alert('Failed to upload image: ' + response.error)
      }
      uploading.value = false
    }
    reader.readAsDataURL(file)
  } catch (error) {
    console.error('Upload error:', error)
    alert('Failed to upload image')
    uploading.value = false
  }
}

const handleSubmit = async () => {
  if (!form.value.title || !form.value.imageUrl) {
    alert('Title and Image are required')
    return
  }

  loading.value = true
  try {
    let response
    if (isEdit.value) {
      response = await updateBanner(editingId.value, form.value)
    } else {
      response = await createBanner(form.value)
    }

    if (response.success) {
      await fetchBanners()
      closeModal()
    } else {
      alert(response.error || 'Operation failed')
    }
  } catch (error) {
    console.error('Submit error:', error)
    alert('An error occurred')
  } finally {
    loading.value = false
  }
}

const handleDelete = async (banner) => {
  if (!confirm(`Are you sure you want to delete banner "${banner.title}"?`)) return

  try {
    const response = await deleteBanner(banner.id)
    if (response.success) {
      await fetchBanners()
    } else {
      alert(response.error || 'Failed to delete banner')
    }
  } catch (error) {
    console.error('Delete error:', error)
    alert('An error occurred')
  }
}

onMounted(() => {
  fetchBanners()
})
</script>

