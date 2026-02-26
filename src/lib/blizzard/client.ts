/**
 * Blizzard API client with OAuth token management
 * Handles authentication and authenticated API calls
 */

import {
  BLIZZARD_API_BASE,
  BLIZZARD_OAUTH_URL,
} from '@/constants/blizzard';

// Module-level token cache (valid within a single server process)
let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Get valid access token from Blizzard OAuth
 * Caches token and reuses if >5 minutes remaining before expiration
 */
async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 300_000) {
    // Use cached token if >5 minutes remaining
    return cachedToken.token;
  }

  const clientId = process.env.BLIZZARD_CLIENT_ID;
  const clientSecret = process.env.BLIZZARD_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'Blizzard API credentials missing. Set BLIZZARD_CLIENT_ID and BLIZZARD_CLIENT_SECRET in .env.local'
    );
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch(BLIZZARD_OAUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store', // Never cache the token fetch itself
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Blizzard OAuth failed: ${res.status} ${error}`);
  }

  const data = await res.json();

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return cachedToken.token;
}

/**
 * Make authenticated request to Blizzard API
 */
export async function blizzardFetch<T>(
  endpoint: string,
  params: Record<string, string>,
  revalidate: number,
): Promise<T> {
  const token = await getAccessToken();

  const url = new URL(`${BLIZZARD_API_BASE}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`Blizzard API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
