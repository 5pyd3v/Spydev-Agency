import { useQuery } from '@tanstack/react-query';
import { navigationApi } from '@/api/entities.api';

export function usePublicNavigation() {
  return useQuery({
    queryKey: ['navigation', 'public'],
    queryFn: () => navigationApi.listPublic(),
    staleTime: 5 * 60 * 1000,
  });
}
