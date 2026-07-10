import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';

export function usePedidos(rol, limit = 10, gigIdFiltro = null) {
  return useInfiniteQuery({
    queryKey: ['pedidos', rol, gigIdFiltro],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient.get('/pedidos', { 
        params: { rol, page: pageParam, limit, gigId: gigIdFiltro } 
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.totalPages) return undefined;
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined ;
    },
  });
}

export function usePedidoDetail(pedidoId) {
  return useQuery({
    queryKey: ['pedidos', pedidoId],
    queryFn: async () => {
      const response = await apiClient.get(`/pedidos/${pedidoId}`);
      return response.data;
    },
    enabled: !!pedidoId,
  });
}

export function useCrearPedido() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (datos) => {
      const response = await apiClient.post('/pedidos', datos);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });
}

export function useCambiarEstadoPedido() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ pedidoId, nuevoEstado }) => {
      const response = await apiClient.patch(`/pedidos/${pedidoId}/estado`, { nuevoEstado });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Actualizamos el cache directamente para una respuesta instantánea
      queryClient.setQueryData(['pedidos', String(variables.pedidoId)], data);
      queryClient.setQueryData(['pedidos', Number(variables.pedidoId)], data);
      // E invalidamos la lista completa en segundo plano
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });
}

export function useMensajesPedido(pedidoId) {
  return useQuery({
    queryKey: ['pedidos', pedidoId, 'mensajes'],
    queryFn: async () => {
      const response = await apiClient.get(`/pedidos/${pedidoId}/mensajes`);
      return response.data;
    },
    enabled: !!pedidoId,
    refetchInterval: 5000, // Polling cada 5 segundos
  });
}

export function useEnviarMensaje() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (datos) => {
      const response = await apiClient.post(`/pedidos/${datos.pedidoId}/mensajes`, datos);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos', variables.pedidoId, 'mensajes'] });
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });
}


