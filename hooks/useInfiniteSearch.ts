'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { searchApi, SearchParams, PaginatedResult } from '@/lib/api';
import { useDebounce } from './useDebounce';

const PAGE_SIZE = 10;

function isEmptySearch(p: SearchParams): boolean {
  return (
    !p.keyword && !p.industry && !p.skill && !p.company && !p.location && (p.page ?? 1) === 1
  );
}

/**
 * Infinite-scroll search. Only active when `enabled` is true (mobile).
 *
 * `initialData` (the server-rendered first page) is seeded only for the
 * default empty search, so the list never collapses to a placeholder on the
 * first paint — a collapsing container mid-scroll is what yanks the page up.
 */
export function useInfiniteSearch(
  initialParams: SearchParams = { page: 1, limit: PAGE_SIZE },
  enabled = true,
  initialData: PaginatedResult | null = null,
) {
  const [params, setParams] = useState<SearchParams>(initialParams);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Mirror query state in refs so the observer never needs re-creating.
  // Re-creating it per fetch re-fires intersection and chains loads that
  // constantly shift the layout while the user is scrolling.
  const canFetchRef = useRef(true);
  const fetchingRef = useRef(false);
  const lockRef = useRef(false);

  const debouncedKeyword = useDebounce(params.keyword, 300);
  const debouncedSkill = useDebounce(params.skill, 300);
  const debouncedCompany = useDebounce(params.company, 300);
  const debouncedLocation = useDebounce(params.location, 300);

  const debouncedParams = useMemo<SearchParams>(
    () => ({
      keyword: debouncedKeyword || undefined,
      industry: params.industry || undefined,
      skill: debouncedSkill || undefined,
      company: debouncedCompany || undefined,
      location: debouncedLocation || undefined,
      limit: params.limit ?? PAGE_SIZE,
    }),
    [debouncedKeyword, params.industry, debouncedSkill, debouncedCompany, debouncedLocation, params.limit],
  );

  const isDefaultSearch = isEmptySearch(debouncedParams);

  const query = useInfiniteQuery<PaginatedResult>({
    queryKey: ['search-infinite', debouncedParams],
    queryFn: ({ pageParam }) =>
      searchApi.search({ ...debouncedParams, page: pageParam as number }),
    initialPageParam: 1,
    // Only seed the very first default view — filtered searches fetch normally
    initialData:
      enabled && initialData && isDefaultSearch
        ? { pages: [initialData], pageParams: [1] }
        : undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta && lastPage.meta.page < lastPage.meta.totalPages
        ? lastPage.meta.page + 1
        : undefined,
    staleTime: 30_000,
    enabled,
  });

  useEffect(() => {
    canFetchRef.current = Boolean(query.hasNextPage);
  }, [query.hasNextPage]);

  useEffect(() => {
    fetchingRef.current = Boolean(query.isFetchingNextPage);
  }, [query.isFetchingNextPage]);

  const search = useCallback((newParams: SearchParams) => {
    setParams((prev) => ({ ...prev, ...newParams, page: 1 }));
  }, []);

  // Stable trigger; lock guarantees one in-flight page load at a time
  const fetchMore = useCallback(() => {
    if (lockRef.current) return;
    if (!canFetchRef.current || fetchingRef.current) return;
    lockRef.current = true;
    query.fetchNextPage().finally(() => {
      lockRef.current = false;
    });
    // fetchNextPage identity is stable in React Query v5
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchMore();
      },
      { rootMargin: '400px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, fetchMore]);

  const users = useMemo(() => query.data?.pages.flatMap((p) => p.data) ?? [], [query.data]);

  return {
    users,
    totalItems: query.data?.pages[0]?.meta?.totalItems ?? 0,
    meta: query.data?.pages[0]?.meta,
    sentinelRef,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    search,
    refetch: query.refetch,
  };
}
