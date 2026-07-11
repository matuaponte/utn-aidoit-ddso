import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Wrapper de almacenamiento persistente.
 * Usa SecureStore en iOS y Android (seguro, encriptado).
 * Usa localStorage en Web (para poder probar en el navegador).
 */

export async function setItemAsync(key, value) {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('Error guardando en localStorage', e);
    }
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

export async function getItemAsync(key) {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Error leyendo de localStorage', e);
      return null;
    }
  } else {
    return await SecureStore.getItemAsync(key);
  }
}

export async function deleteItemAsync(key) {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error borrando de localStorage', e);
    }
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}
