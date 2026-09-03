import axios from 'axios';
import { API_URL } from '@/lib/constants';
import type { PaginatedResult, Statistics } from '@/lib/api';

/**
 * Fetches the first page of results on the server so the initial HTML
 * (seen by crawlers) contains real content without client JS.
 */
export async function getInitialResults(keyword?: string): Promise<PaginatedResult | null> {
  try {
    const { data } = await axios.get<PaginatedResult>(`${API_URL}/users/search`, {
      params: { page: 1, limit: 10, keyword },
      timeout: 5_000,
    });
    return data;
  } catch {
    // Backend unavailable at build/request time — fall back to client fetch
    return null;
  }
}

/**
 * Fetches statistics on the server for the /stats page (SEO + fast first paint).
 */
export async function getStatistics(): Promise<Statistics | null> {
  try {
    const { data } = await axios.get<Statistics>(`${API_URL}/users/statistics`, {
      timeout: 5_000,
    });
    return data;
  } catch {
    return null;
  }
}
