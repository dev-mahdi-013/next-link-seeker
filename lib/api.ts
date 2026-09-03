'use client';

import { API_URL } from '@/lib/constants';
import axios from 'axios';

export interface User {
  id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  gender?: string;
  industry?: string | string[];
  job_title?: string;
  job_company_name?: string;
  location_name?: string;
  location_country?: string;
  linkedin_connections?: string;
  inferred_salary?: string;
  inferred_years_experience?: string;
  summary?: string;
  skills?: string;
  experience?: string;
  emails?: string;
  phone_numbers?: string;
  linkedin_url?: string;
  github_username?: string;
  twitter_username?: string;
}

export interface SearchParams {
  keyword?: string;
  industry?: string;
  skill?: string;
  company?: string;
  location?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResult {
  data: User[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface Statistics {
  totalUsers: number;
  industries: { industry: string; count: number }[];
  countries: { country: string; count: number }[];
  topCompanies: { company: string; count: number }[];
  salaryRanges: { range: string; count: number }[];
  genderDistribution: { gender: string; count: number }[];
}

const api = axios.create({ baseURL: API_URL });

export const searchApi = {
  search: (params: SearchParams): Promise<PaginatedResult> =>
    api.get('/users/search', { params }).then((r) => r.data),
  statistics: (): Promise<Statistics> =>
    api.get('/users/statistics').then((r) => r.data),
};
