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

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new RaiderioError(
        res.status,
        `Raider.io API error ${res.status}: ${errorText || res.statusText}`,
      );
    }

    const data = (await res.json()) as T;
    return data;
  } catch (error) {
    if (error instanceof RaiderioError) {
      throw error;
    }

    throw new Error(
      `Failed to fetch from Raider.io: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
