import axios from 'axios'
import { API_BASE_URL } from '@/shared/utils/constants'
import { getToken, clearAll } from '@/shared/utils/tokenUtils'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, 
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    console.log('axiosConfig request interceptor called')
    const token = getToken()
    console.log('axiosConfig: token from storage:', token ? 'present' : 'not present')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('axiosConfig: Authorization header set')
    }
    console.log('axiosConfig: request config:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
    })
    return config
  },
  (error) => {
    console.error('axiosConfig request interceptor error:', error)
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    console.log('axiosConfig response interceptor success:', {
      status: response.status,
      data: response.data,
    })
    return response
  },
  (error) => {
    console.error('axiosConfig response interceptor error:', error)
    if (error.response) {
      console.error('axiosConfig: error response status:', error.response.status)
      console.error('axiosConfig: error response data:', error.response.data)

      if (error.response.status === 401) {
        console.error('axiosConfig: 401 Unauthorized, clearing session')
        clearAll()
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          window.location.href = '/login'
        }
        return Promise.reject(new Error('Session expired. Please log in again.'))
      }

      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        error.message ||
        'Something went wrong'
      console.error('axiosConfig: extracted error message:', message)
      return Promise.reject(new Error(message))
    } else if (error.request) {
      console.error('axiosConfig: no response received, network error')
      return Promise.reject(new Error('Network error, please try again'))
    } else {
      console.error('axiosConfig: error setting up request:', error.message)
      return Promise.reject(error)
    }
  }
)

export default apiClient
