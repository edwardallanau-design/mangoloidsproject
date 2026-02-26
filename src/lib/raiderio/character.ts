/**
 * Character-level Raider.io API functions
 */

import { raiderioFetch } from './client';
import {
  GUILD_REGION,
  GUILD_REALM,
  CHARACTER_REVALIDATE_SECONDS,
} from '@/constants/raiderio';
import type { CharacterDetail } from '@/types/raiderio';

/**
 * Fetch character detail with M+ scores and gear
 * @param name - Character name
 * @param realm - Realm name (defaults to guild realm if not provided)
 */
export async function fetchCharacterDetail(
  name: string,
  realm: string = GUILD_REALM,
): Promise<CharacterDetail> {
  return raiderioFetch<CharacterDetail>(
    '/characters/profile',
    {
      region: GUILD_REGION,
      realm,
      name,
      fields: 'mythic_plus_scores_by_season,gear',
    },
    CHARACTER_REVALIDATE_SECONDS,
  );
}
