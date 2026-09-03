'use client';

import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchApi, SearchParams, PaginatedResult } from '@/lib/api';
import { useDebounce } from './useDebounce';

export function useDebouncedSearch(initialParams: SearchParams = { page: 1, limit: 10 }, enabled = true) {
  const [params, setParams] = useState<SearchParams>(initialParams);

  const debouncedKeyword = useDebounce(params.keyword, 300);
  const debouncedSkill = useDebounce(params.skill, 300);
  const debouncedCompany = useDebounce(params.company, 300);
  const debouncedLocation = useDebounce(params.location, 300);

  const debouncedParams = useMemo<SearchParams>(
    () => ({
      keyword: debouncedKeyword,
      industry: params.industry,
      skill: debouncedSkill,
      company: debouncedCompany,
      location: debouncedLocation,
      page: params.page,
      limit: params.limit,
    }),
    [debouncedKeyword, params.industry, debouncedSkill, debouncedCompany, params.location, params.page, params.limit],
  );

  const query = useQuery<PaginatedResult>({
    queryKey: ['search', debouncedParams],
    queryFn: () => searchApi.search(debouncedParams),
    staleTime: 30_000,
    enabled,
  });

  const search = useCallback((newParams: SearchParams) => {
    setParams((prev) => ({ ...prev, ...newParams, page: newParams.page ?? 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  return {
    ...query,
    search,
    setPage,
    params: debouncedParams,
  };
}
