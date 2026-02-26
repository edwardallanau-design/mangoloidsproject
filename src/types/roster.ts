/**
 * Guild roster filter types
 */

export type RoleFilter = 'TANK' | 'HEALING' | 'DPS' | null;

export type RosterFilters = {
  search: string;
  role: RoleFilter;
  selectedClasses: string[];
  mythicPlusOnly: boolean;
};
