/**
 * Blizzard WoW API constants
 * Used for guild roster data fetching via official Blizzard API
 */

export const BLIZZARD_API_BASE = 'https://us.api.blizzard.com';
export const BLIZZARD_OAUTH_URL = 'https://oauth.battle.net/token';
export const BLIZZARD_NAMESPACE = 'profile-us'; // OCE uses US region
export const BLIZZARD_LOCALE = 'en_US';

// Guild identifiers (normalized for URL slugs)
export const BLIZZARD_GUILD_REALM_SLUG = 'barthilas';
export const BLIZZARD_GUILD_NAME_SLUG = 'hakuna-muh-nagga';

// Cache duration for guild roster (24 hours)
export const BLIZZARD_GUILD_REVALIDATE_SECONDS = 86400;
