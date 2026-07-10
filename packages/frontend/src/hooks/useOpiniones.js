import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/apiClient';

export function useCrearOpinion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ pedidoId, puntaje, comentario }) => {
      const response = await apiClient.post(`/pedidos/${pedidoId}/opinion`, { puntaje, comentario });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos', variables.pedidoId] });
      queryClient.invalidateQueries({ queryKey: ['gigs'] }); // Invalidar gigs para actualizar rating
    },
  });
}
