import { useQuery } from '@tanstack/react-query';
import { searchApi, SearchParams } from '@/lib/api';

export function useSearch(params: SearchParams) {
  return useQuery({
    queryKey: ['search', params],
    queryFn: () => searchApi.search(params),
    enabled: !!params.keyword || !!params.industry || !!params.company || !!params.location,
    staleTime: 30_000,
  });
}

export function useStatistics() {
  return useQuery({
    queryKey: ['statistics'],
    queryFn: () => searchApi.statistics(),
    staleTime: 60_000,
  });
}
