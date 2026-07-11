import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

/**
 * Paleta de colores personalizada para AI Do It.
 * 
 * ¿Por qué definimos un theme centralizado?
 * - Paper aplica estos colores a TODOS sus componentes automáticamente.
 * - Garantiza consistencia visual sin repetir hex codes por toda la app.
 * - Facilita cumplir WCAG AA: verificamos los contrastes una sola vez acá.
 * 
 * Los colores siguen la especificación Material Design 3 (MD3):
 * - primary: Color principal de la marca (botones, FABs, links activos).
 * - secondary: Color complementario (chips, badges, acentos).
 * - error: Para estados de error y acciones destructivas.
 * - surface: Fondo de tarjetas y superficies elevadas.
 * - background: Fondo general de la app.
 */

const customColors = {
  primary: '#FFC107',       // Amarillo Ámbar Vibrante (Propuesta del usuario)
  onPrimary: '#000000',
  primaryContainer: '#FFE082',
  onPrimaryContainer: '#332600',

  secondary: '#1A1A1A',     // Negro elegante para tarjetas/superficies oscuras
  onSecondary: '#FFFFFF',
  secondaryContainer: '#333333',
  onSecondaryContainer: '#FFFFFF',

  tertiary: '#FF6B6B',      // Mantener Coral para errores/acciones destructivas
  onTertiary: '#FFFFFF',

  error: '#CF6679',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#410002',

  background: '#F5F5F5',    // Fondo claro pero ligeramente grisáceo para que resalten las tarjetas blancas
  onBackground: '#111111',

  surface: '#FFFFFF',
  onSurface: '#111111',
  surfaceVariant: '#EEEEEE',
  onSurfaceVariant: '#444444',

  outline: '#999999',
  outlineVariant: '#DDDDDD',
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...customColors,
  },
  roundness: 12,
};

/**
 * Colores semánticos para estados de pedidos.
 * Separados del theme de Paper porque son específicos de nuestro dominio.
 */
export const estadoColors = {
  PENDIENTE: '#FFA726',     // Naranja — esperando acción
  CONFIRMADO: '#42A5F5',   // Azul — en progreso
  EN_REVISION: '#AB47BC',  // Púrpura — revisando entrega
  ENTREGADO: '#66BB6A',    // Verde — completado
  CANCELADO: '#EF5350',    // Rojo — cancelado
};
