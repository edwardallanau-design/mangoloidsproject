/**
 * Supabase database type definitions
 * Matches the tables created in Supabase SQL editor
 */

export type GuildMemberRow = {
  name: string;
  class: string;
  race: string;
  region: string;
  realm: string;
  rank: number;
  active_spec_name: string | null;
  active_spec_role: string | null;
  profile_url: string;
  mythic_plus_score: number;
  gear_item_level: number | null;
  synced_at: string;
};

export type RaidProgressionRow = {
  raid_slug: string;
  summary: string;
  normal_bosses_killed: number;
  heroic_bosses_killed: number;
  mythic_bosses_killed: number;
  total_bosses: number;
  synced_at: string;
};

export type Database = {
  public: {
    Tables: {
      guild_members: {
        Row: GuildMemberRow;
        Insert: GuildMemberRow;
        Update: Partial<GuildMemberRow>;
      };
      raid_progression: {
        Row: RaidProgressionRow;
        Insert: RaidProgressionRow;
        Update: Partial<RaidProgressionRow>;
      };
    };
  };
};
