/**
 * Guild roster constants
 * Class-to-color mapping and role icons
 */

export const CLASS_COLORS: Record<string, string> = {
  'Warrior': '#C79C6E',       // Brown
  'Paladin': '#F58CBA',       // Pink
  'Hunter': '#ABD473',        // Green
  'Rogue': '#FFF569',         // Yellow
  'Priest': '#FFFFFF',        // White
  'Death Knight': '#C41E3A',  // Red
  'Shaman': '#0070DD',        // Blue
  'Mage': '#69CCF0',          // Cyan
  'Warlock': '#9482CA',       // Purple
  'Monk': '#00FF96',          // Bright Green
  'Druid': '#FF8000',         // Orange
  'Demon Hunter': '#A335EE',  // Purple
  'Evoker': '#F1D00B',        // Gold
};

export const ROLE_ICONS: Record<string, string> = {
  'TANK': '🛡️',
  'HEALING': '✨',
  'DPS': '⚔️',
};

export function getClassColor(className: string): string {
  return CLASS_COLORS[className] || '#808080'; // Gray as fallback
}

export function getRoleIcon(role: string | null): string {
  return role ? ROLE_ICONS[role] || '⚔️' : '⚔️';
}
