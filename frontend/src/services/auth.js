import api from './api'

// Registrar un nuevo usuario
export async function register(email, password) {
  const response = await api.post('/auth/register', { email, password })
  return response.data
}

// Iniciar sesión y guardar el token
export async function login(email, password) {
  const response = await api.post('/auth/login', { email, password })
  const { access_token } = response.data
  localStorage.setItem('token', access_token)
  return response.data
}

// Cerrar sesión eliminando el token
export function logout() {
  localStorage.removeItem('token')
}

// Verificar si el usuario está autenticado
export function isAuthenticated() {
  return !!localStorage.getItem('token')
}
