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
import type { GuildProfile, EnrichedGuildMember, CharacterDetail, GuildCharacter } from '@/types/raiderio';
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
 * Fetch guild raid progression and rankings
 */
export async function fetchGuildProgression() {
  return fetchGuildProfile('raid_progression,raid_rankings');
}

/**
 * Fetch guild members enriched with Mythic+ scores
 * Uses Raider.io guild members endpoint for the member list (name, class, race, rank)
 * Fetches member M+ data from Raider.io in parallel with exponential backoff retry for rate limiting
 */
export async function fetchEnrichedGuildMembers(): Promise<EnrichedGuildMember[]> {
  // Use Raider.io for guild roster
  const guildProfile = await fetchGuildProfile('members');
  const rioMembers = (guildProfile.members ?? []).filter(
    m => m.character.class && m.character.race
  );

  // Fetch M+ scores + gear + spec from Raider.io per character
  const characterDetails = await Promise.allSettled(
    rioMembers.map(m => fetchCharacterDetail(m.character.name, m.character.realm)),
  );

  // Enrich members with M+ scores and gear iLevel, then sort by score descending
  const enriched: EnrichedGuildMember[] = rioMembers.map((member, index) => {
    const result = characterDetails[index];
    let mythicPlusScore = 0;
    let gearItemLevel: number | undefined;

    const character: GuildCharacter = {
      name: member.character.name,
      class: member.character.class,
      race: member.character.race,
      region: GUILD_REGION,
      realm: member.character.realm,
      active_spec_name: member.character.active_spec_name ?? null,
      active_spec_role: member.character.active_spec_role ?? null,
      profile_url: member.character.profile_url,
    };

    if (result.status === 'fulfilled') {
      const detail = result.value as CharacterDetail;

      // Enrich spec + role from Raider.io character detail
      character.active_spec_name = detail.active_spec_name;
      character.active_spec_role = (detail.active_spec_role as GuildCharacter['active_spec_role']) || null;

      // Get M+ score - only current season (exclude preseason/postseason)
      const scores = detail.mythic_plus_scores_by_season;

      if (Array.isArray(scores) && scores.length > 0) {
        const currentSeason = scores.find(
          s => !s.season.toLowerCase().includes('preseason') &&
               !s.season.toLowerCase().includes('postseason')
        ) ?? scores[0];

        if (currentSeason?.scores?.all !== undefined) {
          mythicPlusScore = currentSeason.scores.all;
        }
      }

      // Get equipped gear iLevel
      if (detail.gear?.item_level_equipped) {
        gearItemLevel = detail.gear.item_level_equipped;
      }
    } else if (result.status === 'rejected') {
      console.error(`[M+ Fetch] Failed to fetch M+ for ${member.character.name}:`, result.reason);
    }

    return {
      rank: member.rank,
      character,
      mythicPlusScore,
      gearItemLevel,
    };
  });

  // Sort by M+ score descending (runners at top)
  return enriched.sort((a, b) => b.mythicPlusScore - a.mythicPlusScore);
}
