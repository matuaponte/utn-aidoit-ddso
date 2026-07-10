import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/apiClient';

export function useCrearOpinion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ pedidoId, puntuacion, detalle }) => {
      const response = await apiClient.post(`/pedidos/${pedidoId}/opinion`, { puntuacion, detalle });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos', variables.pedidoId] });
      queryClient.invalidateQueries({ queryKey: ['gigs'] }); // Invalidar gigs para actualizar rating
    },
  });
}
