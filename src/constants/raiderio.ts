/**
 * Raider.io API configuration for "Hakuna Muh Nagga" guild
 * Guild brand: Mangoloids
 * Region: US (OCE servers use US region code)
 * Realm: Barthilas
 */

export const GUILD_REGION = 'us' as const;
export const GUILD_REALM = 'barthilas' as const;
export const GUILD_NAME = 'Hakuna Muh Nagga' as const;
export const RAIDERIO_BASE_URL = 'https://raider.io/api/v1' as const;

/** Guild roster + progression cache: 1 hour (changes infrequently) */
export const GUILD_REVALIDATE_SECONDS = 3600;

/** Character M+ scores + gear cache: 15 minutes (updates more frequently) */
export const CHARACTER_REVALIDATE_SECONDS = 900;
