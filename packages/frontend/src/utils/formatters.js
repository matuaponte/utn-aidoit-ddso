import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';

// Activamos el plugin de tiempo relativo y el idioma español
dayjs.extend(relativeTime);
dayjs.locale('es');

/**
 * Formatea una fecha ISO a formato legible.
 * Ejemplo: '2025-07-08T14:30:00Z' → '08/07/2025 14:30'
 */
export function formatearFecha(fecha) {
  return dayjs(fecha).format('DD/MM/YYYY HH:mm');
}

/**
 * Devuelve un string relativo al momento actual.
 * Ejemplo: '2025-07-08T14:30:00Z' → 'hace 5 minutos'
 * Ideal para timestamps de mensajes del chat.
 */
export function tiempoRelativo(fecha) {
  return dayjs(fecha).fromNow();
}

/**
 * Formatea un precio en formato moneda.
 * Ejemplo: 150 → 'ARS$ 150.00'
 */
export function formatearPrecio(precio) {
  return `ARS ${Number(precio).toFixed(2)}`;
}
