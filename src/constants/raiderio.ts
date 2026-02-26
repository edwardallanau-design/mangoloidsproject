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

/** Guild roster + progression cache: 24 hours (guild composition rarely changes daily) */
export const GUILD_REVALIDATE_SECONDS = 24 * 60 * 60; // 86,400 seconds

/** Character M+ scores + gear cache: 6 hours (M+ rankings update periodically) */
export const CHARACTER_REVALIDATE_SECONDS = 6 * 60 * 60; // 21,600 seconds
