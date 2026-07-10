import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/apiClient';

export function useMensajes(pedidoId) {
  return useQuery({
    queryKey: ['mensajes', pedidoId],
    queryFn: async () => {
      const response = await apiClient.get(`/pedidos/${pedidoId}/mensajes`);
      return response.data;
    },
    enabled: !!pedidoId,
    refetchInterval: 3000, // Poll every 3 seconds for new messages!
  });
}

export function useEnviarMensaje() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ pedidoId, texto }) => {
      const response = await apiClient.post(`/pedidos/${pedidoId}/mensajes`, { texto });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['mensajes', variables.pedidoId] });
    },
  });
}
