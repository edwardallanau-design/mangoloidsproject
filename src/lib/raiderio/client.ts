/**
 * Raider.io API client wrapper
 * Uses Next.js native fetch with ISR caching via next: { revalidate }
 */

import { RAIDERIO_BASE_URL } from '@/constants/raiderio';

export class RaiderioError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'RaiderioError';
  }
}

export async function raiderioFetch<T>(
  endpoint: string,
  params: Record<string, string>,
  revalidate: number,
): Promise<T> {
  const url = new URL(`${RAIDERIO_BASE_URL}${endpoint}`);

  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  // Retry logic with exponential backoff for rate limiting (429)
  const maxRetries = 3;
  let lastError: RaiderioError | Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url.toString(), {
        next: { revalidate },
      });

      if (!res.ok) {
        const errorText = await res.text();
        const error = new RaiderioError(
          res.status,
          `Raider.io API error ${res.status}: ${errorText || res.statusText}`,
        );

        // Retry on rate limit (429)
        if (res.status === 429 && attempt < maxRetries) {
          // Exponential backoff: 1s, 2s, 4s
          const backoffMs = Math.pow(2, attempt) * 1000;
          lastError = error;
          await new Promise(resolve => setTimeout(resolve, backoffMs));
          continue;
        }

        throw error;
      }

      const data = (await res.json()) as T;
      return data;
    } catch (error) {
      if (error instanceof RaiderioError) {
        lastError = error;
        // If it's not a 429, throw immediately
        if (error.status !== 429 || attempt === maxRetries) {
          throw error;
        }
      } else {
        lastError = error instanceof Error ? error : new Error(String(error));
        throw new Error(
          `Failed to fetch from Raider.io: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }
  }

  // If we've exhausted retries
  throw lastError || new Error('Failed to fetch from Raider.io: Unknown error');
}
