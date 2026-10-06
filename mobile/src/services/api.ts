import axios from 'axios';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

/**
 * Determina la URL base del backend según la plataforma:
 * - Android nativo: usa 10.0.2.2 (IP del host desde el emulador)
 * - Navegador web: usa localhost
 */
const getBaseUrl = () => {
  if (Capacitor.getPlatform() === 'android') {
    return 'http://10.0.2.2:3000';
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:3000';
};

/** Instancia centralizada de Axios apuntando a la API de NestJS */
const api = axios.create({
  baseURL: getBaseUrl(),
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