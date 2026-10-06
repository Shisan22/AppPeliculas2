import axios from 'axios';
import { Preferences } from '@capacitor/preferences';

/** Instancia centralizada de Axios apuntando a la API de NestJS */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

/**
 * Interceptor de peticiones: adjunta automáticamente el token JWT
 * almacenado en Capacitor Preferences como header Authorization: Bearer <token>
 */
api.interceptors.request.use(async (config) => {
  const { value: token } = await Preferences.get({ key: 'token' });
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;