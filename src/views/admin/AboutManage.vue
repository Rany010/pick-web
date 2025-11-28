<template>
  <AdminLayout>
    <div class="max-w-4xl mx-auto">
      <div class="md:flex md:items-center md:justify-between mb-6">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">About Section Management</h2>
          <p class="mt-1 text-sm text-gray-500">Manage the content of the "About Us" section on the homepage.</p>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <button
            @click="handleSave"
            :disabled="loading || uploading"
            class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
          >
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg px-4 py-5 sm:p-6 space-y-6">
        <!-- Main Info -->
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900">Main Content</h3>
          <div class="mt-4 space-y-4">
            <!-- Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Title</label>
              <input
                v-model="form.title"
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="About PickleBall Hub"
              />
            </div>

            <!-- Content (Paragraphs) -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Content</label>
              <p class="text-xs text-gray-500 mb-1">Split paragraphs with double newlines.</p>
              <textarea
                v-model="contentRaw"
                rows="6"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="Paragraph 1...&#10;&#10;Paragraph 2..."
              ></textarea>
            </div>

            <!-- Image Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Section Image</label>
              
              <div v-if="form.imageUrl" class="mb-3 relative group w-full md:w-1/2">
                <img :src="getImageUrl(form.imageUrl)" class="w-full h-64 object-cover rounded-lg border border-gray-200" />
                <button 
                  type="button"
                  @click="form.imageUrl = ''"
                  class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div v-else class="flex items-center justify-center w-full md:w-1/2">
                <label class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
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
          </div>
        </div>

        <div class="border-t border-gray-200 pt-6"></div>

        <!-- Features -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Features</h3>
            <button
              type="button"
              @click="addFeature"
              class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none"
            >
              + Add Feature
            </button>
          </div>
          
          <div class="space-y-4">
            <div v-for="(feature, index) in form.features" :key="index" class="flex gap-4 items-start bg-gray-50 p-4 rounded-lg">
              <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-500">Title</label>
                  <input
                    v-model="feature.title"
                    type="text"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Premium Quality"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-500">Description</label>
                  <input
                    v-model="feature.description"
                    type="text"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="USAPA approved equipment"
                  />
                </div>
              </div>
              <button
                type="button"
                @click="removeFeature(index)"
                class="text-red-500 hover:text-red-700"
                title="Remove feature"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
            <div v-if="form.features.length === 0" class="text-sm text-gray-500 text-center py-4">
              No features added yet.
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import { getSetting, updateSetting } from '@/api/settings'
import { uploadImage } from '@/api/admin'

const loading = ref(false)
const uploading = ref(false)
const contentRaw = ref('')

const form = ref({
  title: '',
  content: [], // array of strings
  imageUrl: '',
  features: [] // array of { title, description }
})

// 将 blobKey 转换为完整的图片 URL（用于显示）
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return ''
  if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) return imageUrl
  if (imageUrl.startsWith('/')) return imageUrl
  return `/.netlify/functions/get-image?key=${encodeURIComponent(imageUrl)}`
}

const fetchSettings = async () => {
  loading.value = true
  try {
    const data = await getSetting('about_us')
    if (data) {
      // 确保解析 JSON
      let settings = data
      if (typeof data === 'string') {
          try {
              settings = JSON.parse(data)
          } catch (e) {
              settings = {}
          }
      }
      
      form.value = {
        title: settings.title || '',
        content: Array.isArray(settings.content) ? settings.content : [],
        imageUrl: settings.imageUrl || '',
        features: Array.isArray(settings.features) ? settings.features : []
      }
      
      // Convert array back to string for textarea
      contentRaw.value = form.value.content.join('\n\n')
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  } finally {
    loading.value = false
  }
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
        const blobKey = response.data.blobKey || response.data.imageUrl
        form.value.imageUrl = blobKey
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

const addFeature = () => {
  form.value.features.push({ title: '', description: '' })
}

const removeFeature = (index) => {
  form.value.features.splice(index, 1)
}

const handleSave = async () => {
  loading.value = true
  try {
    console.log('💾 [AboutManage] 开始保存...')
    console.log('💾 [AboutManage] contentRaw.value:', contentRaw.value)
    
    // Process contentRaw back to array (split by double newlines for paragraphs)
    form.value.content = contentRaw.value
      .split(/\n\n+/)
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0)
    
    console.log('💾 [AboutManage] 处理后的 content:', form.value.content)
    console.log('💾 [AboutManage] 完整的 form.value:', JSON.stringify(form.value, null, 2))

    const response = await updateSetting(
      'about_us', 
      form.value, 
      'About Us Section Configuration', 
      'json'
    )

    console.log('💾 [AboutManage] 保存响应:', response)

    if (response.success) {
      alert('Settings saved successfully!')
    } else {
      alert('Failed to save settings.')
    }
  } catch (error) {
    console.error('❌ [AboutManage] Save error:', error)
    alert('An error occurred while saving.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSettings()
})
</script>



