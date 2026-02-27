/**
 * Types for Blizzard WoW Guild Roster API responses
 */

export type BlizzardCharacterRef = {
  name: string;
  id: number;
  realm: {
    slug: string;
    name: string;
    id: number;
  };
  level: number;
  playable_class: {
    id: number;
    name: string;
  };
  playable_race: {
    id: number;
    name: string;
  };
};

export type BlizzardGuildMember = {
  character: BlizzardCharacterRef;
  rank: number;
};

export type BlizzardGuildRosterResponse = {
  guild: {
    name: string;
    realm: {
      slug: string;
    };
  };
  members: BlizzardGuildMember[];
};
