import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/apiClient';

/**
 * Hook para listar Gigs con soporte de paginación infinita y filtros.
 * @param {Object} filtros { q, categoriaId, ordenar, puntajeMinimo }
 */
export function useGigs(filtros = {}) {
  return useInfiniteQuery({
    queryKey: ['gigs', filtros],
    queryFn: async ({ pageParam = 1 }) => {
      // Limpiamos los filtros indefinidos para no mandar "?categoriaId=undefined"
      const params = { ...filtros, page: pageParam, limit: 10 };
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === null || params[key] === '') {
          delete params[key];
        }
      });

      const { data } = await apiClient.get('/gigs', { params });
      return data;
    },
    getNextPageParam: (lastPage) => {
      // Si la página actual es menor al total de páginas, devolvemos la siguiente.
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined; // No hay más páginas
    },
    initialPageParam: 1,
  });
}

/**
 * Hook secundario para traer el detalle completo de un solo Gig
 * @param {number|string} id 
 */
export function useGigDetail(id) {
  return useQuery({
    queryKey: ['gigs', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/gigs/${id}`);
      return data;
    },
    enabled: !!id, // Solo se ejecuta si hay un ID válido
  });
}

/**
 * Hook para traer las opiniones de un Gig
 * @param {number|string} gigId 
 */
export function useGigOpiniones(gigId) {
  return useQuery({
    queryKey: ['gigs', gigId, 'opiniones'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/gigs/${gigId}/opiniones`);
      return data;
    },
    enabled: !!gigId,
  });
}

/**
 * Hook para crear un nuevo Gig (Freelancer)
 */
export function useCrearGig() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (datosGig) => {
      const { data } = await apiClient.post('/gigs', datosGig);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gigs'] });
    },
  });
}
