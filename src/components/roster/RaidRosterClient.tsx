'use client';

import type { RaidProgression } from '@/types/raiderio';
import type { RaidTeam } from '@/types/raid';
import { RaidProgressBar } from './RaidProgressBar';
import { RaidTeamCard } from './RaidTeamCard';

/**
 * Client component for the raid roster tab
 * Displays progression bars and team cards
 */
export function RaidRosterClient({
  teams,
  progression,
}: {
  teams: RaidTeam[];
  progression: RaidProgression;
}) {
  const raidTiers = Object.entries(progression);

  return (
    <div className="space-y-8">
      {/* Raid Teams Section */}
      {teams.length > 0 && (
        <div className="space-y-6">
          {teams.map(team => (
            <RaidTeamCard key={team.name} team={team} />
          ))}
        </div>
      )}

      {teams.length === 0 && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-8 text-center">
          <p className="text-foreground/70">
            No raid teams configured yet. Check back later!
          </p>
        </div>
      )}
    </div>
  );
}
