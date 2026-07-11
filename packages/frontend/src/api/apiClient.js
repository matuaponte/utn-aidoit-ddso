import axios from 'axios';
import * as SecureStore from '../utils/storage';
import { Platform, Alert } from 'react-native';

/**
 * Cliente HTTP centralizado para consumir la API REST del backend.
 * 
 * ¿Por qué un archivo separado para Axios?
 * - Centraliza la baseURL: si cambiamos el servidor, se cambia en UN solo lugar.
 * - El interceptor de request inyecta el JWT automáticamente en CADA petición.
 * - El interceptor de response maneja errores globales (token expirado → logout).
 * 
 * Nota sobre la baseURL:
 * - En emulador Android, localhost del emulador NO es localhost del PC.
 *   Android usa 10.0.2.2 para referirse al host.
 * - En dispositivo físico, usá la IP local de tu red WiFi.
 * - En iOS Simulator, localhost funciona directamente.
 */

const TOKEN_KEY = 'ai_do_it_jwt';

function resolveBaseURL() {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // Para que funcione en un iPhone físico o cualquier otro dispositivo en la red WiFi o tethering,
  // necesitamos usar la IP local de la computadora en lugar de localhost.
  return 'http://192.168.0.5:3000/api';
}

const apiClient = axios.create({
  baseURL: resolveBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de REQUEST:
 * Antes de cada petición, lee el JWT de SecureStore y lo adjunta
 * como header Authorization: Bearer <token>.
 * Si no hay token (usuario no logueado), la petición sale sin header.
 */
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let unauthorizedListeners = [];

export function subscribeUnauthorized(listener) {
  unauthorizedListeners.push(listener);
  return () => {
    unauthorizedListeners = unauthorizedListeners.filter(l => l !== listener);
  };
}

function notifyUnauthorized() {
  unauthorizedListeners.forEach(listener => listener());
}

/**
 * Interceptor de RESPONSE:
 * Captura errores globales del backend.
 * Si el servidor responde 401 (token inválido/expirado), limpiamos el token y notificamos.
 * Los errores específicos (404, 400, 409) se propagan al componente que hizo la llamada.
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si el token expiró o es inválido, lo borramos de SecureStore
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      notifyUnauthorized();
    }
    
    // Normalizamos el error para que los componentes lo consuman fácilmente
    let mensaje = error.response?.data?.mensaje || error.message || 'Ocurrió un error inesperado en el servidor.';
    
    // Si es un error de Zod de validación (400) con la estructura { errors: [{ path, message }] }
    if (error.response?.status === 400 && error.response?.data?.errors) {
      mensaje = error.response.data.errors.map(e => `${e.path}: ${e.message}`).join('\n');
    }
      
    return Promise.reject({
      status: error.response?.status ?? 0,
      mensaje,
      original: error,
    });
  }
);

export { TOKEN_KEY };
export default apiClient;

