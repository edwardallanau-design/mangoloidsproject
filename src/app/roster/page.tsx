import { fetchGuildMembers } from '@/lib/raiderio/guild';
import type { GuildMember } from '@/types/raiderio';

/**
 * Guild Roster Page
 * Server Component that fetches live member data from Raider.io
 * Data is cached for 1 hour via ISR (Incremental Static Regeneration)
 */

// Class-to-color mapping for guild roster
const CLASS_COLORS: Record<string, string> = {
  'Warrior': '#C79C6E',      // Brown
  'Paladin': '#F58CBA',      // Pink
  'Hunter': '#ABD473',       // Green
  'Rogue': '#FFF569',        // Yellow
  'Priest': '#FFFFFF',       // White
  'Death Knight': '#C41E3A', // Red
  'Shaman': '#0070DD',       // Blue
  'Mage': '#69CCF0',         // Cyan
  'Warlock': '#9482CA',      // Purple
  'Monk': '#00FF96',         // Bright Green
  'Druid': '#FF8000',        // Orange
  'Demon Hunter': '#A335EE', // Purple
  'Evoker': '#F1D00B',       // Gold
};

const ROLE_ICONS: Record<string, string> = {
  'TANK': '🛡️',
  'HEALING': '✨',
  'DPS': '⚔️',
};

function getClassColor(className: string): string {
  return CLASS_COLORS[className] || '#808080'; // Gray as fallback
}

function getMemberCard(member: GuildMember) {
  const { character } = member;
  const classColor = getClassColor(character.class);
  const roleIcon = ROLE_ICONS[character.active_spec_role || 'DPS'];

  return (
    <a
      key={character.profile_url}
      href={character.profile_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-lg border border-primary/20 bg-primary/5 p-6 transition-all hover:border-primary/50 hover:bg-primary/10"
    >
      {/* Header: Class Name + Role */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {character.name}
          </h3>
          <p className="text-sm text-foreground/70">
            <span style={{ color: classColor }} className="font-medium">
              {character.class}
            </span>
            {character.active_spec_name && (
              <>
                {' '}
                • <span className="text-foreground/60">{character.active_spec_name}</span>
              </>
            )}
          </p>
        </div>
        {roleIcon && (
          <div className="text-2xl">{roleIcon}</div>
        )}
      </div>

      {/* Meta: Race, Rank, Achievement Points */}
      <div className="mt-4 space-y-2 text-xs text-foreground/60">
        <div>
          <span className="font-medium">Race:</span> {character.race}
        </div>
        <div>
          <span className="font-medium">Rank:</span> {member.rank}
        </div>
        <div>
          <span className="font-medium">Achievements:</span> {character.achievement_points.toLocaleString()}
        </div>
        <div className="pt-2 text-xs text-foreground/50">
          Updated: {new Date(character.last_crawled_at).toLocaleDateString()}
        </div>
      </div>
    </a>
  );
}

export default async function RosterPage() {
  let members: GuildMember[] = [];
  let error: string | null = null;

  try {
    members = await fetchGuildMembers();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to fetch roster';
    console.error('[Roster] Error fetching members:', error);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-16">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Guild Roster</h1>
        <p className="text-lg text-foreground/70">
          Meet the legendary members of Hakuna Muh Nagga.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-accent/30 bg-accent/10 p-6">
          <p className="text-accent">
            <span className="font-semibold">Error loading roster:</span> {error}
          </p>
          <p className="mt-2 text-sm text-accent/80">
            The guild data will refresh automatically in 1 hour.
          </p>
        </div>
      ) : members.length === 0 ? (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
          <p className="text-foreground/70">No members found. Please try again later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map(member => getMemberCard(member))}
        </div>
      )}

      {/* Data Source Attribution */}
      <div className="mt-8 border-t border-primary/10 pt-6 text-center text-xs text-foreground/50">
        <p>
          Guild data provided by{' '}
          <a
            href="https://raider.io"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            Raider.io
          </a>
          • Last updated: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
}
