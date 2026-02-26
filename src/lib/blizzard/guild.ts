/**
 * Blizzard Guild Roster API integration
 * Fetches authoritative guild member list from official Blizzard API
 */

import { blizzardFetch } from './client';
import type { BlizzardGuildMember, BlizzardGuildRosterResponse } from '@/types/blizzard';
import {
  BLIZZARD_GUILD_REALM_SLUG,
  BLIZZARD_GUILD_NAME_SLUG,
  BLIZZARD_NAMESPACE,
  BLIZZARD_LOCALE,
  BLIZZARD_GUILD_REVALIDATE_SECONDS,
} from '@/constants/blizzard';

/**
 * Fetch guild roster from Blizzard API
 * Returns list of BlizzardGuildMember with character and rank info
 */
export async function fetchBlizzardGuildRoster(): Promise<BlizzardGuildMember[]> {
  const response = await blizzardFetch<BlizzardGuildRosterResponse>(
    `/data/wow/guild/${BLIZZARD_GUILD_REALM_SLUG}/${BLIZZARD_GUILD_NAME_SLUG}/roster`,
    {
      namespace: BLIZZARD_NAMESPACE,
      locale: BLIZZARD_LOCALE,
    },
    BLIZZARD_GUILD_REVALIDATE_SECONDS,
  );

  return response.members;
}
