import { fetchEnrichedGuildMembers } from '@/lib/raiderio/guild';
import type { EnrichedGuildMember } from '@/types/raiderio';
import { RosterClient } from '@/components/roster/RosterClient';

/**
 * Guild Roster Page
 * Async Server Component that fetches live member data from Raider.io
 * Enriches members with Mythic+ scores (fetched in parallel)
 * Data is cached for 15 minutes via ISR (Incremental Static Regeneration)
 *
 * Renders RosterClient (Client Component) for interactive filtering
 */

export default async function RosterPage() {
  let members: EnrichedGuildMember[] = [];
  let error: string | null = null;

  try {
    members = await fetchEnrichedGuildMembers();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to fetch roster';
    console.error('[Roster] Error fetching members:', error);
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
            The guild data will refresh automatically in 1 hour.
          </p>
        </div>
      ) : members.length === 0 ? (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
          <p className="text-foreground/70">No members found. Please try again later.</p>
        </div>
      ) : (
        <RosterClient
          members={members}
          availableClasses={availableClasses}
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
