import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';

export function useCategorias() {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      const { data } = await apiClient.get('/categorias');
      return data;
    },
    staleTime: 1000 * 60 * 60, // 1 hora, las categorías no cambian mucho
  });
}
