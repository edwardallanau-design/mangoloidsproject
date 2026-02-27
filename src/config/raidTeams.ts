/**
 * Guild raid team configuration
 * Edit this file to define raid teams and their members
 */

export type RaidTeamConfig = {
  name: string;
  description?: string;
  members: string[]; // character names (case-insensitive match against guild roster)
};

/**
 * Define raid teams here
 * Character names must match exactly (case-insensitive) with guild roster members
 */
export const RAID_TEAMS: RaidTeamConfig[] = [
  {
    name: 'Mango Pickers',
    description: '8/8 M',
    members: [
      'Palahubog',
      'Kuyakulata',
      'Dawnxo',
      'Arakova',
      'Sunkyu',
      'Jan',
      'Kinkou',
      'Salerovia',
      'Aoii',
      'Hae',
      'Spankmi',
      'Equick/Kaeion',
      'Bryan',
      'Buchi',
      'Real',
      'Red',
      'Prim',
      'Anton',
      'Schmozy',
      'Vyxie',
      'Binguyen'
    ],
  },
  {
    name: 'Dawnbreakers',
    description: '4/8M',
    members: [
      // Add character names here
    ],
  },
    {
    name: 'Cucubears',
    description: '7/8M',
    members: [
      // Add character names here
    ],
  },
];
