import { fetchEnrichedGuildMembers, fetchGuildProgression } from '@/lib/raiderio/guild';
import type { EnrichedGuildMember, RaidProgression } from '@/types/raiderio';
import type { RaidTeam } from '@/types/raid';
import { RAID_TEAMS } from '@/config/raidTeams';
import { RosterTabs } from '@/components/roster/RosterTabs';

/**
 * Guild Roster Page (Dual Tab)
 * Async Server Component that fetches:
 * 1. Live member data from Raider.io (enriched with M+ scores and gear)
 * 2. Raid progression data from Raider.io
 * 3. Resolves configurable raid teams against live member data
 *
 * Data is cached via ISR (6 hours for M+/gear, 24 hours for guild roster)
 * Renders RosterTabs (Client) for tab switching and interactive filtering
 */

export default async function RosterPage() {
  let members: EnrichedGuildMember[] = [];
  let progression: RaidProgression = {};
  let teams: RaidTeam[] = [];
  let error: string | null = null;

  try {
    // Fetch both data sources in parallel
    const [fetchedMembers, progressionProfile] = await Promise.all([
      fetchEnrichedGuildMembers(),
      fetchGuildProgression(),
    ]);

    members = fetchedMembers;
    progression = progressionProfile.raid_progression ?? {};

    // Resolve raid teams from config by cross-referencing with live member data
    teams = RAID_TEAMS.map(config => {
      const resolved = config.members.map(name => {
        const found = members.find(
          m => m.character.name.toLowerCase() === name.toLowerCase()
        );
        return found
          ? {
              name: found.character.name,
              class: found.character.class,
              role: found.character.active_spec_role,
              profileUrl: found.character.profile_url,
              gearItemLevel: found.gearItemLevel,
            }
          : { name, class: 'Unknown', role: null, profileUrl: '#' };
      });

      return {
        name: config.name,
        description: config.description,
        mainRoster: resolved.slice(0, 20),
        bench: resolved.slice(20),
      };
    });
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to fetch roster';
    console.error('[Roster] Error fetching data:', error);
  }

  // Derive unique classes from the members data
  const availableClasses = Array.from(
    new Set(members.map(m => m.character.class))
  ).sort();

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
            The guild data will refresh automatically in 6 hours.
          </p>
        </div>
      ) : members.length === 0 ? (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
          <p className="text-foreground/70">No members found. Please try again later.</p>
        </div>
      ) : (
        <RosterTabs
          members={members}
          availableClasses={availableClasses}
          teams={teams}
          progression={progression}
        />
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
