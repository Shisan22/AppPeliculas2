import api from './api';
import { Preferences } from '@capacitor/preferences';

const TOKEN_KEY = 'token';

/**
 * Servicio de autenticación.
 * Gestiona login, registro, logout y verificación del estado de sesión
 * usando JWT persistido con Capacitor Preferences.
 */
export const authService = {
  /** Inicia sesión y almacena el token JWT recibido */
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.access_token) {
      await Preferences.set({ key: TOKEN_KEY, value: response.data.access_token });
    }
    return response.data;
  },

  /** Registra un nuevo usuario */
  register: (data: { email: string; password: string }) => {
    return api.post('/auth/register', data);
  },

  /** Cierra sesión eliminando el token persistido */
  logout: async () => {
    await Preferences.remove({ key: TOKEN_KEY });
  },

  /** Verifica si existe un token almacenado (usuario autenticado) */
  isAuthenticated: async (): Promise<boolean> => {
    const { value } = await Preferences.get({ key: TOKEN_KEY });
    return !!value;
  }
};