import { useQuery } from '@tanstack/react-query';
import { homepageSectionsApi } from '@/api/homepageSections.api';

export function usePublicHomepageSections() {
  return useQuery({
    queryKey: ['homepage-sections', 'public'],
    queryFn: homepageSectionsApi.listPublic,
    staleTime: 60 * 1000,
  });
}
