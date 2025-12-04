import useSWR from 'swr';
import { PortfolioData } from '@/types';

/**
 * Fetcher function for SWR
 * Fetches data from the given URL and returns JSON
 */
const fetcher = async (url: string): Promise<PortfolioData> => {
  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error('Failed to fetch portfolio data');
    throw error;
  }

  return response.json();
};

/**
 * Custom hook for fetching portfolio data with SWR
 * Provides caching, revalidation, and loading/error states
 * 
 * Requirements: 12.3 (Performance optimization with caching)
 * 
 * @returns {object} Portfolio data, loading state, error state, and mutate function
 */
export function usePortfolioData() {
  const { data, error, isLoading, mutate } = useSWR<PortfolioData>(
    '/api/portfolio',
    fetcher,
    {
      // Revalidate on focus to keep data fresh
      revalidateOnFocus: true,
      // Revalidate on reconnect
      revalidateOnReconnect: true,
      // Dedupe requests within 2 seconds
      dedupingInterval: 2000,
      // Keep previous data while revalidating
      keepPreviousData: true,
      // Retry on error with exponential backoff
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      // Revalidate every hour in the background
      refreshInterval: 3600000,
    }
  );

  return {
    portfolioData: data,
    isLoading,
    isError: error,
    mutate,
  };
}
