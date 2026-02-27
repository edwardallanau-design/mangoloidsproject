import { getSupabase } from '@/lib/db/supabase';
import type { EnrichedGuildMember, RaidProgression } from '@/types/raiderio';
import type { RaidTeam } from '@/types/raid';
import { RAID_TEAMS } from '@/config/raidTeams';
import { RosterTabs } from '@/components/roster/RosterTabs';

/**
 * Guild Roster Page (Dual Tab)
 * Reads pre-synced data from Supabase — no live API calls on page load.
 * Data is refreshed every 6 hours by the /api/sync Vercel Cron job.
 */

// Revalidate every 6 hours to match the sync schedule
export const revalidate = 21600;

export default async function RosterPage() {
  let members: EnrichedGuildMember[] = [];
  let progression: RaidProgression = {};
  let teams: RaidTeam[] = [];
  let error: string | null = null;
  let lastSynced: string | null = null;

  try {
    const supabase = getSupabase();

    // Read from Supabase in parallel
    const [membersResult, progressionResult] = await Promise.all([
      supabase
        .from('guild_members')
        .select('*')
        .order('mythic_plus_score', { ascending: false }),
      supabase
        .from('raid_progression')
        .select('*'),
    ]);

    if (membersResult.error) throw new Error(membersResult.error.message);
    if (progressionResult.error) throw new Error(progressionResult.error.message);

    // Map DB rows → EnrichedGuildMember[]
    members = (membersResult.data ?? []).map(row => ({
      rank: row.rank,
      character: {
        name: row.name,
        class: row.class,
        race: row.race,
        region: row.region,
        realm: row.realm,
        active_spec_name: row.active_spec_name,
        active_spec_role: row.active_spec_role as EnrichedGuildMember['character']['active_spec_role'],
        profile_url: row.profile_url,
      },
      mythicPlusScore: row.mythic_plus_score,
      gearItemLevel: row.gear_item_level ?? undefined,
    }));

    // Map DB rows → RaidProgression record
    progression = Object.fromEntries(
      (progressionResult.data ?? []).map(row => [
        row.raid_slug,
        {
          summary: row.summary,
          total_bosses: row.total_bosses,
          normal_bosses_killed: row.normal_bosses_killed,
          heroic_bosses_killed: row.heroic_bosses_killed,
          mythic_bosses_killed: row.mythic_bosses_killed,
        },
      ])
    );

    // Resolve raid teams from config against live member data
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

    // Track when data was last synced
    if (membersResult.data && membersResult.data.length > 0) {
      lastSynced = membersResult.data[0].synced_at;
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load roster';
    console.error('[Roster] Error loading from DB:', error);
  }

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
        </div>
      ) : members.length === 0 ? (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center space-y-2">
          <p className="text-foreground/70 font-medium">No roster data yet.</p>
          <p className="text-sm text-foreground/50">
            Trigger a sync by calling <code className="text-primary">GET /api/sync</code> with your{' '}
            <code className="text-primary">CRON_SECRET</code>.
          </p>
        </div>
      ) : (
        <RosterTabs
          members={members}
          availableClasses={availableClasses}
          teams={teams}
          progression={progression}
        />
      )}

      <div className="mt-8 border-t border-primary/10 pt-6 text-center text-xs text-foreground/50">
        <p>
          Guild data from{' '}
          <a href="https://raider.io" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            Raider.io
          </a>
          {lastSynced && (
            <> · Last synced: {new Date(lastSynced).toLocaleString()}</>
          )}
        </p>
      </div>
    </div>
  );
}
