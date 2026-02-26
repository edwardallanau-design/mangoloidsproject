/**
 * Guild-level Raider.io API functions
 */

import { raiderioFetch } from './client';
import {
  GUILD_REGION,
  GUILD_REALM,
  GUILD_NAME,
  GUILD_REVALIDATE_SECONDS,
} from '@/constants/raiderio';
import type { GuildProfile, GuildMember } from '@/types/raiderio';

/**
 * Fetch full guild profile with specified fields
 * @param fields - Comma-separated list of fields (raid_progression, raid_rankings, members)
 */
export async function fetchGuildProfile(
  fields: string = 'raid_progression,raid_rankings',
): Promise<GuildProfile> {
  return raiderioFetch<GuildProfile>(
    '/guilds/profile',
    {
      region: GUILD_REGION,
      realm: GUILD_REALM,
      name: GUILD_NAME,
      fields,
    },
    GUILD_REVALIDATE_SECONDS,
  );
}

/**
 * Fetch only the guild roster (members list)
 */
export async function fetchGuildMembers(): Promise<GuildMember[]> {
  const profile = await fetchGuildProfile('members');
  return profile.members || [];
}

/**
 * Fetch guild raid progression and rankings
 */
export async function fetchGuildProgression() {
  return fetchGuildProfile('raid_progression,raid_rankings');
}
