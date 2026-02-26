/**
 * Types for raid team display (resolved from config + live guild data)
 */

export type RaidTeamMember = {
  name: string;
  class: string;
  role: 'TANK' | 'HEALING' | 'DPS' | null;
  profileUrl: string;
  gearItemLevel?: number;
};

export type RaidTeam = {
  name: string;
  description?: string;
  mainRoster: RaidTeamMember[]; // first 20 members
  bench: RaidTeamMember[]; // remaining members beyond 20
};
