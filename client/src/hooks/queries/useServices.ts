import { useQuery } from '@tanstack/react-query';
import { servicesApi } from '@/api/services.api';

export function usePublicServices() {
  return useQuery({
    queryKey: ['services', 'public'],
    queryFn: () => servicesApi.listPublic(),
    staleTime: 60 * 1000,
  });
}

export function usePublicService(slug: string | undefined) {
  return useQuery({
    queryKey: ['services', 'public', slug],
    queryFn: () => servicesApi.getPublicBySlug(slug as string),
    enabled: !!slug,
  });
}
