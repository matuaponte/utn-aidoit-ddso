import React, { createContext, useContext, useEffect, useReducer } from 'react';
import * as SecureStore from '../utils/storage';
import apiClient, { TOKEN_KEY, subscribeUnauthorized } from '../api/apiClient';
import { useQueryClient } from '@tanstack/react-query';

const AuthContext = createContext(null);

const initialState = {
  isLoading: true,
  user: null,
  token: null,
  sessionExpired: false,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        sessionExpired: action.payload.sessionExpired || false,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        sessionExpired: false,
        isLoading: false,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        token: null,
        user: null,
        sessionExpired: action.payload?.sessionExpired || false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

const extractError = (error, defaultMsg) => {
  const data = error.response?.data;
  if (!data) return defaultMsg;
  if (data.errors && data.errors.length > 0) {
    return data.errors.map(e => e.message).join('\n');
  }
  return data.message || data.error || defaultMsg;
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const queryClient = useQueryClient();

  useEffect(() => {
    // 1. Intentamos leer el token de memoria segura al abrir la app
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await SecureStore.getItemAsync(TOKEN_KEY);
        if (userToken) {
          // 2. Si hay token, pedimos los datos del usuario al backend (/me)
          const response = await apiClient.get('/usuarios/me');
          dispatch({ type: 'RESTORE_TOKEN', payload: { token: userToken, user: response.data, sessionExpired: false } });
        } else {
          // No hay token guardado
          dispatch({ type: 'RESTORE_TOKEN', payload: { token: null, user: null, sessionExpired: false } });
        }
      } catch (e) {
        // Token inválido o backend caído
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        const is401 = e.status === 401;
        dispatch({ type: 'RESTORE_TOKEN', payload: { token: null, user: null, sessionExpired: is401 } });
      }
    };

    bootstrapAsync();
  }, []);

  // Suscribirse a eventos 401 (Unauthorized) globales
  useEffect(() => {
    const unsubscribe = subscribeUnauthorized(() => {
      queryClient.clear();
      dispatch({ type: 'SIGN_OUT', payload: { sessionExpired: true } });
    });
    return unsubscribe;
  }, [queryClient]);


  const authContext = {
    ...state,
    login: async (email, password) => {
      try {
        const response = await apiClient.post('/auth/login', { email, password });
        const { token, usuario } = response.data;
        
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        dispatch({ type: 'SIGN_IN', payload: { token, user: usuario } });
        return { success: true };
      } catch (error) {
        return { success: false, error: extractError(error, 'Error al iniciar sesión') };
      }
    },
    register: async (nombre, apellido, email, password) => {
      try {
        const response = await apiClient.post('/auth/register', { nombre, apellido, email, password });
        const { token, usuario } = response.data;
        
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        dispatch({ type: 'SIGN_IN', payload: { token, user: usuario } });
        return { success: true };
      } catch (error) {
        return { success: false, error: extractError(error, 'Error al registrarse') };
      }
    },
    updateProfile: async (nombre, apellido, passwordActual, passwordNueva) => {
      try {
        const response = await apiClient.put('/usuarios/me', { nombre, apellido, passwordActual, passwordNueva });
        // The backend returns the updated user object
        dispatch({ type: 'RESTORE_TOKEN', payload: { token: state.token, user: response.data } });
        return { success: true };
      } catch (error) {
        return { success: false, error: extractError(error, 'Error al actualizar perfil') };
      }
    },
    logout: async () => {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      queryClient.clear(); // Limpiamos la caché de react-query al cerrar sesión!
      dispatch({ type: 'SIGN_OUT' });
    },
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook para usar el context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
