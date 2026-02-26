/**
 * TypeScript types for Raider.io API responses
 * Derived from live API responses for the Hakuna Muh Nagga guild
 */

// ==================== Guild Roster ====================

export type GuildCharacter = {
  name: string;
  race: string;
  class: string;
  active_spec_name: string | null;
  active_spec_role: 'DPS' | 'TANK' | 'HEALING' | null;
  region: string;
  realm: string;
  profile_url: string;
  // Optional: only populated when sourced from Raider.io guild endpoint
  gender?: string;
  faction?: string;
  achievement_points?: number;
  last_crawled_at?: string;
  profile_banner?: string;
};

export type GuildMember = {
  rank: number;
  character: GuildCharacter;
};

export type EnrichedGuildMember = GuildMember & {
  mythicPlusScore: number; // 0 if not a runner or data unavailable
  gearItemLevel?: number; // Equipped item level from character detail
};

// ==================== Raid Progression ====================

export type RaidBossProgression = {
  summary: string;                // e.g., "4/8 M"
  total_bosses: number;
  normal_bosses_killed: number;
  heroic_bosses_killed: number;
  mythic_bosses_killed: number;
};

export type RaidProgression = Record<string, RaidBossProgression>;

// ==================== Raid Rankings ====================

export type RaidRankEntry = {
  world: number;
  region: number;
  realm: number;
};

export type RaidRankings = Record<string, {
  normal: RaidRankEntry;
  heroic: RaidRankEntry;
  mythic: RaidRankEntry;
}>;

// ==================== Guild Profile (Root) ====================

export type GuildProfile = {
  name: string;
  faction: string;
  region: string;
  realm: string;
  last_crawled_at: string;
  raid_progression?: RaidProgression;
  raid_rankings?: RaidRankings;
  members?: GuildMember[];
};

// ==================== Character Detail ====================

export type MythicPlusScores = {
  all: number;
  dps: number;
  healer: number;
  tank: number;
};

export type MythicPlusSeason = {
  season: string;
  scores: MythicPlusScores;
};

export type GearItem = {
  item_id: number;
  item_level: number;
  name: string;
  icon: string;
  item_quality: string;
  bonuses?: number[];
  gems_detail?: Array<{ item_id: number; display_string: string }>;
  enchants_detail?: Array<{ display_string: string }>;
};

export type GearDetail = {
  created_at: string;
  updated_at: string;
  item_level_equipped: number;
  item_level_total: number;
  items: Record<string, GearItem>;
};

export type CharacterDetail = {
  name: string;
  class: string;
  active_spec_name: string | null;
  active_spec_role: string | null;
  mythic_plus_scores_by_season: MythicPlusSeason[];
  gear: GearDetail;
};
