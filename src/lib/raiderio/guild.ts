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
import { fetchBlizzardGuildRoster } from '@/lib/blizzard/guild';
import type { BlizzardGuildMember } from '@/types/blizzard';

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
 * Uses Blizzard API for authoritative member list (name, class, race, rank)
 * Fetches member M+ data from Raider.io in parallel with exponential backoff retry for rate limiting
 */
export async function fetchEnrichedGuildMembers(): Promise<EnrichedGuildMember[]> {
  // Use Blizzard API for authoritative guild roster
  const blizzardMembers = await fetchBlizzardGuildRoster();

  // Fetch M+ scores + gear + spec from Raider.io per character
  const characterDetails = await Promise.allSettled(
    blizzardMembers.map(m => fetchCharacterDetail(m.character.name)),
  );

  // Enrich members with M+ scores and gear iLevel, then sort by score descending
  const enriched: EnrichedGuildMember[] = blizzardMembers.map((blizzMember, index) => {
    const result = characterDetails[index];
    let mythicPlusScore = 0;
    let gearItemLevel: number | undefined;

    // Build character from Blizzard data
    const character: GuildCharacter = {
      name: blizzMember.character.name,
      class: blizzMember.character.playable_class.name,
      race: blizzMember.character.playable_race.name,
      region: GUILD_REGION,
      realm: blizzMember.character.realm.slug,
      active_spec_name: null,
      active_spec_role: null,
      // Construct Raider.io profile URL for card links
      profile_url: `https://raider.io/characters/${GUILD_REGION}/${blizzMember.character.realm.slug}/${blizzMember.character.name}`,
    };

    if (result.status === 'fulfilled') {
      const detail = result.value as CharacterDetail;

      // Enrich spec + role from Raider.io character detail
      character.active_spec_name = detail.active_spec_name;
      character.active_spec_role = (detail.active_spec_role as GuildCharacter['active_spec_role']) || null;

      // Get M+ score - only current season (exclude preseason/postseason)
      const scores = detail.mythic_plus_scores_by_season;

      if (Array.isArray(scores) && scores.length > 0) {
        // Find current season by excluding preseason and postseason
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
      // Log failed character fetches for debugging
      console.error(`[M+ Fetch] Failed to fetch M+ for ${blizzMember.character.name}:`, result.reason);
    }

    return {
      rank: blizzMember.rank,
      character,
      mythicPlusScore,
      gearItemLevel,
    };
  });

  // Sort by M+ score descending (runners at top)
  return enriched.sort((a, b) => b.mythicPlusScore - a.mythicPlusScore);
}
