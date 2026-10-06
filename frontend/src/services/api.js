import axios from 'axios'

// Crear instancia de axios con la URL base del backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

// Interceptor para agregar el token JWT a cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
