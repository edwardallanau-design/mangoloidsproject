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
import type { GuildProfile, GuildMember, EnrichedGuildMember, CharacterDetail } from '@/types/raiderio';
import { fetchCharacterDetail } from './character';

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

/**
 * Fetch guild members enriched with Mythic+ scores
 * Fetches member M+ data in parallel with exponential backoff retry for rate limiting
 */
export async function fetchEnrichedGuildMembers(): Promise<EnrichedGuildMember[]> {
  const members = await fetchGuildMembers();

  // Fetch M+ scores in parallel - the API client handles rate limit retries
  const characterDetails = await Promise.allSettled(
    members.map(m => fetchCharacterDetail(m.character.name)),
  );

  // Enrich members with M+ scores and gear iLevel, then sort by score descending
  const enriched: EnrichedGuildMember[] = members.map((member, index) => {
    const result = characterDetails[index];
    let mythicPlusScore = 0;
    let gearItemLevel: number | undefined;

    if (result.status === 'fulfilled') {
      const detail = result.value as CharacterDetail;
      // Get M+ score - look for the current/latest season
      const scores = detail.mythic_plus_scores_by_season;

      if (Array.isArray(scores) && scores.length > 0) {
        // Try the first season (current season)
        const season = scores[0];
        if (season?.scores?.all !== undefined) {
          mythicPlusScore = season.scores.all;
        }
      }

      // Get equipped gear iLevel
      if (detail.gear?.item_level_equipped) {
        gearItemLevel = detail.gear.item_level_equipped;
      }
    } else if (result.status === 'rejected') {
      // Log failed character fetches for debugging
      console.error(`[M+ Fetch] Failed to fetch M+ for ${member.character.name}:`, result.reason);
    }

    return {
      ...member,
      mythicPlusScore,
      gearItemLevel,
    };
  });

  // Sort by M+ score descending (runners at top)
  return enriched.sort((a, b) => b.mythicPlusScore - a.mythicPlusScore);
}
