import axios from 'axios'

const API_BASE = '/.netlify/functions'

export const getSetting = async (key) => {
  try {
    const response = await axios.get(`${API_BASE}/get-setting`, {
      params: { key }
    })
    // get-setting 返回 success(result)，即 response.data.data 就是 result
    return response.data.data
  } catch (error) {
    console.error(`Failed to fetch setting ${key}:`, error)
    return null
  }
}

export const updateSetting = async (key, value, description = '', type = 'json') => {
  try {
    const token = localStorage.getItem('admin_token')
    const response = await axios.post(`${API_BASE}/admin-setting-update`, {
      key,
      value,
      description,
      type
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error(`Failed to update setting ${key}:`, error)
    throw error
  }
}



